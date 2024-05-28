package io.raffael.cert_manager.service;

import io.raffael.cert_manager.dto.AwsDeploymentDTO;
import io.raffael.cert_manager.model.AwsDeployment;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Service
public class AwsDeploymentConverter {

    public AwsDeploymentDTO convert(AwsDeployment awsDeployment) {
        if (awsDeployment == null) {
            return null;
        }
        OffsetDateTime execution = awsDeployment.getExecution() != null ? awsDeployment.getExecution().atOffset(ZoneOffset.UTC) : null;

        return AwsDeploymentDTO.builder()
                .execution(execution)
                .certificateArn(awsDeployment.getCertificateArn())
                .build();
    }
}
