package io.raffael.cert_manager.model;

import lombok.Getter;

@Getter
public enum KeystoreType {
    PKCS12 ("pkcs12"),
    JKS ("jks");

    private final String value;

    KeystoreType(String value) {
        this.value = value;
    }
}
