package io.raffael.cert_manager.dto;

import io.raffael.cert_manager.model.Algorithm;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeyDTO {
    private Integer size;
    private Algorithm algorithm;
    private String secretEngine;
    private String modulus;
}
