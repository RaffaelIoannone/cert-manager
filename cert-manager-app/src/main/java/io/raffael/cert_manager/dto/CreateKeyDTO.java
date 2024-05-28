package io.raffael.cert_manager.dto;

import io.raffael.cert_manager.model.Algorithm;
import io.raffael.cert_manager.model.SecretEngine;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateKeyDTO {

    @Min(128)
    private Integer size;

    @NotNull
    private Algorithm algorithm;

    @NotNull
    private SecretEngine secretEngine;
}
