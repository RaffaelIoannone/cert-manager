package io.raffael.cert_manager.service;

import io.raffael.cert_manager.dto.CertificateDTO;
import io.raffael.cert_manager.dto.CreateCertificateDTO;
import io.raffael.cert_manager.dto.SignCertificateDTO;
import io.raffael.cert_manager.dto.UploadSignedCertificateDTO;
import io.raffael.cert_manager.exception.KeyMismatchException;
import io.raffael.cert_manager.exception.ObjectNotFoundException;
import io.raffael.cert_manager.exception.UnsupportedActionException;
import io.raffael.cert_manager.exception.UnsupportedAlgorithmException;
import io.raffael.cert_manager.model.*;
import io.raffael.cert_manager.repository.CertificateRepository;
import io.raffael.cert_manager.security.EncryptionService;
import lombok.RequiredArgsConstructor;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.springframework.stereotype.Service;

import javax.naming.InvalidNameException;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.CertificateParsingException;
import java.security.cert.X509Certificate;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CertificateConverter certificateConverter;
    private final CryptoService cryptoService;
    private final EncryptionService encryptionService;
    private final AwsDeploymentService awsDeploymentService;
    private final PemConverter pemConverter;

    public List<CertificateDTO> getCertificates(boolean revoked, boolean caOnly, boolean expiring, boolean keystore) {
        List<Certificate> certificates = null;
        if (revoked) {
            certificates = certificateRepository.findByState(CertificateState.REVOCATION);
        } else if (caOnly) {
            certificates = certificateRepository.findByStateNotInAndCertificateAuthority(Arrays.asList(CertificateState.REVOCATION, CertificateState.CREATION), true);
        } else if (expiring) {
            Instant validUntilFrom = LocalDateTime.now().minusDays(2).toInstant(ZoneOffset.UTC);
            Instant validUntilTo = LocalDateTime.now().plusMonths(2).toInstant(ZoneOffset.UTC);
            certificates = certificateRepository.findByStateNotInAndValidUntilBetween(Arrays.asList(CertificateState.REVOCATION, CertificateState.CREATION), validUntilFrom, validUntilTo);
        } else if (keystore) {
            certificates = certificateRepository.findByStateIn(Arrays.asList(CertificateState.DISTRIBUTION, CertificateState.RENEWAL));
        } else {
            certificates = certificateRepository.findByStateNot(CertificateState.REVOCATION);
        }
        return certificates.stream()
                .map(certificateConverter::convert)
                .collect(Collectors.toList());
    }

    public CertificateDTO getCertificate(String id) {
        Certificate certificate = certificateRepository.findById(id).orElseThrow(ObjectNotFoundException::new);
        return certificateConverter.convert(certificate);
    }

    public CertificateDTO revokeCertificate(String id) {
        Certificate certificate = certificateRepository.findById(id).orElseThrow(ObjectNotFoundException::new);
        certificate.setState(CertificateState.REVOCATION);
        Key key = certificate.getKey();
        key.setPrivateKey(null);
        certificate.setKey(key);
        certificateRepository.save(certificate);
        return certificateConverter.convert(certificate);
    }

    public CertificateDTO createCertificate(CreateCertificateDTO dto) {
        switch (dto.getKey().getAlgorithm()) {
            case Algorithm.RSA -> {
                return createRSACertificate(dto);
            }
            default -> {
                throw new UnsupportedAlgorithmException();
            }
        }
    }

    private CertificateDTO createRSACertificate(CreateCertificateDTO dto) {
        try {
            KeyPair keyPair = cryptoService.generateRSAKeyPair(dto.getKey().getSize());
            RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
            String privateKeyString = encryptionService.encrypt(pemConverter.privateKeyToPem(keyPair.getPrivate()));
            Key key = Key.builder()
                    .size(dto.getKey().getSize())
                    .algorithm(dto.getKey().getAlgorithm())
                    .privateKey(privateKeyString)
                    .publicKey(pemConverter.publicKeyToPem(keyPair.getPublic()))
                    .secretEngine(SecretEngine.JAVA.toString())
                    .modulus(privateKey.getModulus().toString())
                    .build();

            PKCS10CertificationRequest csr = cryptoService.generateCSR(keyPair, dto.getSubject().convertToPrincipal(), dto.getCertificateAuthority(), dto.getSubjectAlternativeNames());
            Certificate certificate = Certificate.builder()
                    .name(dto.getName())
                    .state(CertificateState.CREATION)
                    .csr(pemConverter.csrToPem(csr))
                    .subject(dto.getSubject())
                    .subjectAlternativeNames(dto.getSubjectAlternativeNames())
                    .key(key)
                    .certificateAuthority(dto.getCertificateAuthority())
                    .build();
            certificate = certificateRepository.save(certificate);
            return certificateConverter.convert(certificate);
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    public CertificateDTO uploadSignedCertificate(String id, UploadSignedCertificateDTO dto) {
        Certificate certificate = certificateRepository.findById(id).orElseThrow(ObjectNotFoundException::new);
        if (certificate.getState() != CertificateState.CREATION) {
            throw new UnsupportedActionException();
        }
        if (certificate.getKey().getAlgorithm() != Algorithm.RSA) {
            throw new UnsupportedAlgorithmException();
        }
        try {
            X509Certificate rootCA = pemConverter.deserializeCertificate(dto.getRootCA());
            List<X509Certificate> chain = dto.getChain().stream().map(pemConverter::deserializeCertificate).toList();
            cryptoService.verifyChain(chain, rootCA);
            X509Certificate cert = chain.getFirst();

            RSAPublicKey publicKey = (RSAPublicKey) cert.getPublicKey();
            if (!certificate.getKey().getModulus().equals(publicKey.getModulus().toString())) {
                throw new KeyMismatchException();
            }
            certificate.setState(CertificateState.DISTRIBUTION);
            certificate.setValue(dto.getChain().getFirst());
            certificate.setRootCA(dto.getRootCA());
            certificate.setChain(dto.getChain());
            certificate.setSerialNumber(cert.getSerialNumber().toString());
            certificate.setSha1Fingerprint(cryptoService.getSHA1Fingerprint(cert));
            certificate.setSha256Fingerprint(cryptoService.getSHA256Fingerprint(cert));
            certificate.setValidFrom(cert.getNotBefore().toInstant());
            certificate.setValidUntil(cert.getNotAfter().toInstant());
            certificate.setSubject(new DistinguishedName(cert.getSubjectX500Principal()));
            certificate.setIssuer(new DistinguishedName(cert.getIssuerX500Principal()));
            if (cert.getSubjectAlternativeNames() != null) {
                certificate.setSubjectAlternativeNames(cert.getSubjectAlternativeNames().stream().map(SubjectAlternativeName::new).collect(Collectors.toList()));
            }
            certificate.setCertificateAuthority(cert.getBasicConstraints() != -1);
            certificate = certificateRepository.save(certificate);
        } catch (CertificateException | NoSuchAlgorithmException | InvalidNameException e) {
            throw new RuntimeException();
        }
        return certificateConverter.convert(certificate);
    }

    public CertificateDTO signCertificate(String id, SignCertificateDTO dto) {
        Certificate certificate = certificateRepository.findById(id).orElseThrow(ObjectNotFoundException::new);
        Certificate ca = certificateRepository.findById(dto.getCa()).orElseThrow(ObjectNotFoundException::new);
        if (id.equals(dto.getCa())) {
            if (certificate.getState() != CertificateState.CREATION) {
                throw new UnsupportedActionException();
            }
        } else {
            if (certificate.getState() != CertificateState.CREATION ||
                    ca.getState() == CertificateState.REVOCATION ||
                    ca.getState() == CertificateState.CREATION ||
                    !ca.getCertificateAuthority()) {
                throw new UnsupportedActionException();
            }
        }
        if (certificate.getKey().getAlgorithm() != Algorithm.RSA) {
            throw new UnsupportedAlgorithmException();
        }
        try {
        PKCS10CertificationRequest csr = pemConverter.deserializeCsr(certificate.getCsr());
        KeyPair subjectKeyPair = cryptoService.deserializeKeyPair(certificate.getKey());
        X509Certificate signedCertificate = null;
        if (id.equals(dto.getCa())) {
            signedCertificate = cryptoService.selfSigneCertificate(csr, subjectKeyPair, dto.getNotBefore(), dto.getNotAfter());
            certificate.setValue(pemConverter.certificateToPem(signedCertificate));
            certificate.setRootCA(certificate.getValue());
            certificate.setChain(Collections.singletonList(certificate.getValue()));
        } else {
            X509Certificate caCertificate = pemConverter.deserializeCertificate(ca.getValue());
            KeyPair issuerKeyPair = cryptoService.deserializeKeyPair(ca.getKey());
            signedCertificate = cryptoService.signCertificate(csr, caCertificate, subjectKeyPair.getPublic(), issuerKeyPair.getPrivate(), dto.getNotBefore(), dto.getNotAfter());
            certificate.setValue(pemConverter.certificateToPem(signedCertificate));
            certificate.setRootCA(ca.getRootCA());
            List<String> chain = new ArrayList<>(ca.getChain());
            chain.remove(certificate.getRootCA());
            chain.addFirst(certificate.getValue());
            certificate.setChain(chain);
        }

        certificate.setState(CertificateState.DISTRIBUTION);
        certificate.setSerialNumber(signedCertificate.getSerialNumber().toString());
        certificate.setSha1Fingerprint(cryptoService.getSHA1Fingerprint(signedCertificate));
        certificate.setSha256Fingerprint(cryptoService.getSHA256Fingerprint(signedCertificate));
        certificate.setValidFrom(signedCertificate.getNotBefore().toInstant());
        certificate.setValidUntil(signedCertificate.getNotAfter().toInstant());
        certificate.setSubject(new DistinguishedName(signedCertificate.getSubjectX500Principal()));
        certificate.setIssuer(new DistinguishedName(signedCertificate.getIssuerX500Principal()));
        if (signedCertificate.getSubjectAlternativeNames() != null) {
            certificate.setSubjectAlternativeNames(signedCertificate.getSubjectAlternativeNames().stream().map(SubjectAlternativeName::new).collect(Collectors.toList()));
        }
        certificate.setCertificateAuthority(signedCertificate.getBasicConstraints() != -1);
        certificate = certificateRepository.save(certificate);
        return certificateConverter.convert(certificate);
        } catch (InvalidNameException | CertificateEncodingException | NoSuchAlgorithmException |
                 CertificateParsingException e) {
            throw new RuntimeException(e);
        }
    }

    public CertificateDTO deployToAws(String id) {
        Certificate certificate = certificateRepository.findById(id).orElseThrow(ObjectNotFoundException::new);
        if (certificate.getState() != CertificateState.DISTRIBUTION && certificate.getState() != CertificateState.RENEWAL) {
            throw new UnsupportedActionException();
        }
        KeyPair keyPair = cryptoService.deserializeKeyPair(certificate.getKey());
        String arn = awsDeploymentService.deploy(certificate.getValue(), pemConverter.privateKeyToPem(keyPair.getPrivate()));
        AwsDeployment awsDeployment = AwsDeployment.builder()
                .certificateArn(arn)
                .execution(LocalDateTime.now().toInstant(ZoneOffset.UTC)).build();
        List<AwsDeployment> awsDeployments = certificate.getAwsDeployments();
        if (awsDeployments == null) {
            awsDeployments = new ArrayList<>();
        }
        awsDeployments.add(awsDeployment);
        certificate.setAwsDeployments(awsDeployments);
        certificate = certificateRepository.save(certificate);
        return certificateConverter.convert(certificate);
    }

    public CertificateDTO renew(String id, CreateCertificateDTO dto) {
        CertificateDTO certificateDTO = createCertificate(dto);
        Certificate oldCertificate = certificateRepository.findById(id).orElseThrow(ObjectNotFoundException::new);
        List<String> renewedInstances = oldCertificate.getRenewedInstances();
        if (renewedInstances == null) {
            renewedInstances = new ArrayList<>();
        }
        renewedInstances.add(id);
        oldCertificate.setRenewedInstances(renewedInstances);
        if (oldCertificate.getState() != CertificateState.REVOCATION) {
            oldCertificate.setState(CertificateState.RENEWAL);
        }
        certificateRepository.save(oldCertificate);

        Certificate certificate = certificateRepository.findById(certificateDTO.getId()).orElseThrow(ObjectNotFoundException::new);
        certificate.setOldInstance(id);
        certificate = certificateRepository.save(certificate);
        return certificateConverter.convert(certificate);
    }
}
