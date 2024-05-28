package io.raffael.cert_manager.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AwsDeploymentDTO {
    private OffsetDateTime execution;
    private String certificateArn;
}
