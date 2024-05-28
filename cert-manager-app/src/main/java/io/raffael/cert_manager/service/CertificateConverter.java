package io.raffael.cert_manager.service;

import io.raffael.cert_manager.dto.AwsDeploymentDTO;
import io.raffael.cert_manager.dto.CertificateDTO;
import io.raffael.cert_manager.dto.CertificateReferenceDTO;
import io.raffael.cert_manager.dto.KeyDTO;
import io.raffael.cert_manager.model.Certificate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CertificateConverter {

    private final KeyConverter keyConverter;
    private final AwsDeploymentConverter awsDeploymentConverter;

    public CertificateDTO convert(Certificate certificate) {
        if (certificate == null) {
            return null;
        }
        KeyDTO key = keyConverter.convert(certificate.getKey());
        OffsetDateTime validFrom = certificate.getValidFrom() != null ? certificate.getValidFrom().atOffset(ZoneOffset.UTC) : null;
        OffsetDateTime validUntil = certificate.getValidUntil() != null ? certificate.getValidUntil().atOffset(ZoneOffset.UTC): null;
        List<AwsDeploymentDTO> awsDeployments = certificate.getAwsDeployments() != null ? certificate.getAwsDeployments().stream().map(awsDeploymentConverter::convert).toList() : new ArrayList<>();
        return CertificateDTO.builder()
                .id(certificate.getId())
                .name(certificate.getName())
                .state(certificate.getState())
                .csr(certificate.getCsr())
                .value(certificate.getValue())
                .rootCA(certificate.getRootCA())
                .chain(certificate.getChain())
                .serialNumber(certificate.getSerialNumber())
                .sha1Fingerprint(certificate.getSha1Fingerprint())
                .sha256Fingerprint(certificate.getSha256Fingerprint())
                .validFrom(validFrom)
                .validUntil(validUntil)
                .subject(certificate.getSubject())
                .issuer(certificate.getIssuer())
                .subjectAlternativeNames(certificate.getSubjectAlternativeNames())
                .key(key)
                .certificateAuthority(certificate.getCertificateAuthority())
                .awsDeployments(awsDeployments)
                .build();
    }

    public CertificateReferenceDTO convertToReference(Certificate certificate) {
        if (certificate == null) {
            return null;
        }
        return CertificateReferenceDTO.builder()
                .id(certificate.getId())
                .name(certificate.getName())
                .state(certificate.getState())
                .serialNumber(certificate.getSerialNumber())
                .sha1Fingerprint(certificate.getSha1Fingerprint())
                .sha256Fingerprint(certificate.getSha256Fingerprint())
                .validFrom(certificate.getValidFrom().atOffset(ZoneOffset.UTC))
                .validUntil(certificate.getValidUntil().atOffset(ZoneOffset.UTC))
                .subject(certificate.getSubject())
                .issuer(certificate.getIssuer())
                .subjectAlternativeNames(certificate.getSubjectAlternativeNames())
                .certificateAuthority(certificate.getCertificateAuthority())
                .build();
    }
}
