package io.raffael.cert_manager.dto;

import io.raffael.cert_manager.model.KeystoreEntryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateKeystoreEntryDTO {

    @NotBlank
    private String alias;

    @NotNull
    private KeystoreEntryType type;

    @NotBlank
    private String certificateId;

    private Boolean includeRootCA;
}
