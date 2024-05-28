package io.raffael.cert_manager.model;

import lombok.Getter;

@Getter
public enum KeystoreEntryType {
    TRUSTED_CERTIFICATE,
    ASYMMETRIC_KEY
}
