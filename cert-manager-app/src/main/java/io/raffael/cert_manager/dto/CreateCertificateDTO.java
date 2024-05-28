package io.raffael.cert_manager.dto;

import io.raffael.cert_manager.model.DistinguishedName;
import io.raffael.cert_manager.model.SubjectAlternativeName;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CreateCertificateDTO {

    @NotBlank()
    private String name;

    @NotNull
    private DistinguishedName subject;

    @NotNull
    private List<@Valid SubjectAlternativeName> subjectAlternativeNames;

    @Valid
    @NotNull
    private CreateKeyDTO key;

    @NotNull
    private Boolean certificateAuthority;

}
