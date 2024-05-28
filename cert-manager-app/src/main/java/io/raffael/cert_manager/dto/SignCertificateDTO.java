package io.raffael.cert_manager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class SignCertificateDTO {

    @NotBlank
    private String ca;

    @NotNull
    Date notBefore;

    @NotNull
    Date notAfter;

}
