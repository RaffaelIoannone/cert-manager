package io.raffael.cert_manager.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document("certificates")
public class Certificate {

    @Id
    private String id;
    private String name;
    private CertificateState state;
    private String csr;
    private String value;
    private String rootCA;
    private List<String> chain;
    private String serialNumber;
    private String sha1Fingerprint;
    private String sha256Fingerprint;
    private Instant validFrom;
    private Instant validUntil;
    private DistinguishedName subject;
    private DistinguishedName issuer;
    private List<SubjectAlternativeName> subjectAlternativeNames;
    private Key key;
    private Boolean certificateAuthority;
    private List<AwsDeployment> awsDeployments;

    private String oldInstance;
    private List<String> renewedInstances;

}
