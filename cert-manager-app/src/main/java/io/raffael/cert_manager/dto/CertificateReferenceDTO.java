package io.raffael.cert_manager.dto;

import io.raffael.cert_manager.model.CertificateState;
import io.raffael.cert_manager.model.DistinguishedName;
import io.raffael.cert_manager.model.SubjectAlternativeName;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateReferenceDTO {

    private String id;
    private String name;
    private CertificateState state;
    private String serialNumber;
    private String sha1Fingerprint;
    private String sha256Fingerprint;
    private OffsetDateTime validFrom;
    private OffsetDateTime validUntil;
    private DistinguishedName subject;
    private DistinguishedName issuer;
    private List<SubjectAlternativeName> subjectAlternativeNames;
    private Boolean certificateAuthority;

}
