package io.raffael.cert_manager.model;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Key {
    private Integer size;
    private Algorithm algorithm;
    private String privateKey;
    private String publicKey;
    private String secretEngine;
    private String modulus;

}
