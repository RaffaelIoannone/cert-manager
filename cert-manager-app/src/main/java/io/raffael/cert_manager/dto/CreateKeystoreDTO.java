package io.raffael.cert_manager.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CreateKeystoreDTO {

    @NotBlank()
    private String name;

    @NotBlank
    private String description;

    @NotNull
    private List<@Valid CreateKeystoreEntryDTO> entries;

}
