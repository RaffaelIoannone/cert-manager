package io.raffael.cert_manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CertManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CertManagerApplication.class, args);
    }

}
