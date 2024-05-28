package io.raffael.cert_manager.dto;

import io.raffael.cert_manager.model.KeystoreEntryType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeystoreEntryDTO {
    private String alias;
    private KeystoreEntryType type;
    private CertificateReferenceDTO certificate;
    private Boolean includeRootCA;

}
