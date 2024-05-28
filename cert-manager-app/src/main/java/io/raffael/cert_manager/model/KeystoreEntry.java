package io.raffael.cert_manager.model;

import io.raffael.cert_manager.dto.CreateKeystoreEntryDTO;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KeystoreEntry {
    private String alias;
    private KeystoreEntryType type;
    private String certificateId;
    private Boolean includeRootCA;

    public KeystoreEntry(CreateKeystoreEntryDTO dto) {
        this.alias = dto.getAlias();
        this.type = dto.getType();
        this.certificateId = dto.getCertificateId();
        if (type.equals(KeystoreEntryType.ASYMMETRIC_KEY)) {
            this.includeRootCA = dto.getIncludeRootCA() != null ? dto.getIncludeRootCA() : false;
        }
    }
}
