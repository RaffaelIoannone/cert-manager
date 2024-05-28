package io.raffael.cert_manager.service;

import io.raffael.cert_manager.dto.KeyDTO;
import io.raffael.cert_manager.model.Key;
import org.springframework.stereotype.Service;

@Service
public class KeyConverter {

    public KeyDTO convert(Key key) {
        if (key == null) {
            return null;
        }
        return KeyDTO.builder()
                .size(key.getSize())
                .algorithm(key.getAlgorithm())
                .secretEngine(key.getSecretEngine())
                .modulus(key.getModulus())
                .build();
    }
}
