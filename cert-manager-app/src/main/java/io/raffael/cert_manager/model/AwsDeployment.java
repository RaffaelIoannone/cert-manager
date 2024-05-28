package io.raffael.cert_manager.model;

import lombok.*;

import java.time.Instant;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AwsDeployment {
    private Instant execution;
    private String certificateArn;

}
