package io.raffael.cert_manager.dto;

import io.raffael.cert_manager.model.KeystoreType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class CreateKeystoreFileDTO {

    @NotNull()
    private KeystoreType type;

    @NotBlank
    private String filename;

    @NotBlank
    private String password;

    @NotNull
    private Map<@NotBlank String,@NotNull String> entries;

}
