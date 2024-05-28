package io.raffael.cert_manager.service;

import io.raffael.cert_manager.dto.CreateKeystoreFileDTO;
import io.raffael.cert_manager.exception.CertificateChainException;
import io.raffael.cert_manager.exception.CertificateSigningException;
import io.raffael.cert_manager.model.Certificate;
import io.raffael.cert_manager.model.Key;
import io.raffael.cert_manager.model.*;
import io.raffael.cert_manager.security.EncryptionService;
import jakarta.xml.bind.DatatypeConverter;
import lombok.RequiredArgsConstructor;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.*;
import org.bouncycastle.cert.CertIOException;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.pkcs.PKCS10CertificationRequestBuilder;
import org.bouncycastle.pkcs.jcajce.JcaPKCS10CertificationRequestBuilder;
import org.springframework.stereotype.Service;

import javax.security.auth.x500.X500Principal;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.security.*;
import java.security.cert.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CryptoService {

    private static final String SIGNATURE_ALGORITHM = "SHA256withRSA";
    private final EncryptionService encryptionService;
    private final PemConverter pemConverter;

    public KeyPair generateRSAKeyPair(Integer size) throws NoSuchAlgorithmException {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(size);
        return keyPairGenerator.generateKeyPair();
    }

    public PKCS10CertificationRequest generateCSR(KeyPair keyPair, X500Principal subject, Boolean ca, List<SubjectAlternativeName> subjectAltNames) throws OperatorCreationException, IOException {
        PKCS10CertificationRequestBuilder pkcs10Builder = new JcaPKCS10CertificationRequestBuilder(subject, keyPair.getPublic());
        JcaContentSignerBuilder contentSignerBuilder = new JcaContentSignerBuilder(SIGNATURE_ALGORITHM);
        ContentSigner signer = contentSignerBuilder.build(keyPair.getPrivate());
        ExtensionsGenerator extensionsGenerator = new ExtensionsGenerator();

        extensionsGenerator.addExtension(Extension.basicConstraints, true, new BasicConstraints(ca));

        if (!subjectAltNames.isEmpty()) {
            GeneralName[] subjectAltNamesArray = subjectAltNames.stream().map(SubjectAlternativeName::toGeneralName).toArray(GeneralName[]::new);
            extensionsGenerator.addExtension(Extension.subjectAlternativeName, true, new GeneralNames(subjectAltNamesArray));
        }

        KeyUsage keyUsage = new KeyUsage(KeyUsage.digitalSignature | KeyUsage.keyEncipherment | KeyUsage.keyAgreement);
        extensionsGenerator.addExtension(Extension.keyUsage, true, keyUsage);

        pkcs10Builder.addAttribute(PKCSObjectIdentifiers.pkcs_9_at_extensionRequest, extensionsGenerator.generate());
        return pkcs10Builder.build(signer);
    }

    public X509Certificate signCertificate(PKCS10CertificationRequest csr, X509Certificate ca, PublicKey subjectPublicKey, PrivateKey issuerPrivateKey, Date notBefore, Date notAfter) {
        try{
            BigInteger serial = new BigInteger(32, new SecureRandom());
            X509v3CertificateBuilder certificateBuilder  = new JcaX509v3CertificateBuilder(ca, serial, notBefore, notAfter, csr.getSubject(), subjectPublicKey);
            Extensions extensions = csr.getRequestedExtensions();
            for (ASN1ObjectIdentifier extension : extensions.getExtensionOIDs()) {
                certificateBuilder.addExtension(extensions.getExtension(extension));
            }
            JcaContentSignerBuilder contentSignerBuilder = new JcaContentSignerBuilder(SIGNATURE_ALGORITHM);
            ContentSigner signer = contentSignerBuilder.build(issuerPrivateKey);
            X509CertificateHolder holder = certificateBuilder.build(signer);
            return new JcaX509CertificateConverter().getCertificate(holder);
        } catch (CertificateException | OperatorCreationException | CertIOException e) {
            throw new CertificateSigningException();
        }
    }

    public X509Certificate selfSigneCertificate(PKCS10CertificationRequest csr, KeyPair keyPair, Date notBefore, Date notAfter)  {
        try {
            BigInteger serial = new BigInteger(32, new SecureRandom());
            X509v3CertificateBuilder certificateBuilder  = new JcaX509v3CertificateBuilder(csr.getSubject(), serial, notBefore, notAfter, csr.getSubject(), keyPair.getPublic());
            Extensions extensions = csr.getRequestedExtensions();
            for (ASN1ObjectIdentifier extension : extensions.getExtensionOIDs()) {
                certificateBuilder.addExtension(extensions.getExtension(extension));
            }
            JcaContentSignerBuilder contentSignerBuilder = new JcaContentSignerBuilder(SIGNATURE_ALGORITHM);
            ContentSigner signer = contentSignerBuilder.build(keyPair.getPrivate());
            X509CertificateHolder holder = certificateBuilder.build(signer);
            return new JcaX509CertificateConverter().getCertificate(holder);
        } catch (CertificateException | OperatorCreationException | CertIOException e) {
            throw new CertificateSigningException();
        }
    }

    public KeyPair deserializeKeyPair(Key key) {
        PublicKey publicKey = pemConverter.deserializePublicKey(key.getAlgorithm(), key.getPublicKey());
        String priavteKeyString = encryptionService.decrypt(key.getPrivateKey());
        PrivateKey privateKey = pemConverter.deserializePrivateKey(key.getAlgorithm(), priavteKeyString);
        return new KeyPair(publicKey, privateKey);
    }

    public void verifyChain(List<X509Certificate> chain, X509Certificate rootCA) {
        try {
            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            CertPath certPath = certificateFactory.generateCertPath(chain);
            CertPathValidator certPathValidator = CertPathValidator.getInstance("PKIX");
            TrustAnchor trustAnchor = new TrustAnchor(rootCA, null);
            PKIXParameters parameters = new PKIXParameters(Collections.singleton(trustAnchor));
            parameters.setRevocationEnabled(false);
            PKIXCertPathValidatorResult validatorResult = (PKIXCertPathValidatorResult) certPathValidator.validate(certPath, parameters);
            if (validatorResult.getTrustAnchor().getTrustedCert() == null) {
                throw new RuntimeException();
            }
        } catch (CertificateException | NoSuchAlgorithmException | CertPathValidatorException |
                 InvalidAlgorithmParameterException e) {
            throw new CertificateChainException();
        }
    }

    public String getSHA1Fingerprint(X509Certificate certificate) throws CertificateEncodingException, NoSuchAlgorithmException {
        return getFingerprint(certificate, "SHA-1");
    }
    public String getSHA256Fingerprint(X509Certificate certificate) throws CertificateEncodingException, NoSuchAlgorithmException {
        return getFingerprint(certificate, "SHA-256");
    }

    private String getFingerprint(X509Certificate certificate, String algorithm) throws NoSuchAlgorithmException, CertificateEncodingException {
        MessageDigest messageDigest = MessageDigest.getInstance(algorithm);
        byte[] digest = messageDigest.digest(certificate.getEncoded());
        return formatHex(DatatypeConverter.printHexBinary(digest));
    }

    private String formatHex(String input) {
        return input.toUpperCase().replaceAll("..(?!$)", "$0:");
    }


    public byte[] createKeystoreFile(Keystore keystore, CreateKeystoreFileDTO dto, Map<String, Certificate> certificates) {
        try {
            KeyStore keyStore = KeyStore.getInstance(dto.getType().getValue());
            keyStore.load(null, dto.getPassword().toCharArray());
            for (KeystoreEntry entry : keystore.getEntries()) {
                Certificate certificate = certificates.get(entry.getCertificateId());
                X509Certificate cert = pemConverter.deserializeCertificate(certificate.getValue());
                switch (entry.getType()) {
                    case ASYMMETRIC_KEY -> {
                        PrivateKey key = deserializeKeyPair(certificate.getKey()).getPrivate();
                        List<String> chainList = new ArrayList<>(certificate.getChain());
                        if (entry.getIncludeRootCA() != null && entry.getIncludeRootCA() && !certificate.getValue().equals(certificate.getRootCA())) {
                            chainList.addLast(certificate.getRootCA());
                        }
                        X509Certificate[] chain = chainList.stream().map(pemConverter::deserializeCertificate).toArray(X509Certificate[]::new);
                        char[] password = dto.getPassword().toCharArray();
                        if (dto.getEntries().containsKey(certificate.getId())) {
                            password = dto.getEntries().get(certificate.getId()).toCharArray();
                        }
                        keyStore.setKeyEntry(entry.getAlias(), key, password, chain);
                    }
                    case TRUSTED_CERTIFICATE -> {
                        keyStore.setCertificateEntry(entry.getAlias(), cert);
                    }
                }
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            keyStore.store(out, dto.getPassword().toCharArray());
            return out.toByteArray();
        } catch (CertificateException | KeyStoreException | IOException | NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
