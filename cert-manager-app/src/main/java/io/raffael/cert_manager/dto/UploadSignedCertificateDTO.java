package io.raffael.cert_manager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class UploadSignedCertificateDTO {

    @NotBlank
    private String rootCA;

    @NotEmpty
    private List<String> chain;

}
