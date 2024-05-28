package io.raffael.cert_manager.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;

@Getter
@Setter
@ConfigurationProperties(prefix = "cert-manager.data-encryption")
public class EncryptionProperties {
    private Resource keystore;
    private String password;
    private String alias;
}
