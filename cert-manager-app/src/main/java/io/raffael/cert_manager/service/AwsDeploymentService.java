package io.raffael.cert_manager.service;

import io.raffael.cert_manager.exception.DeploymentException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.acm.AcmClient;
import software.amazon.awssdk.services.acm.model.ImportCertificateRequest;
import software.amazon.awssdk.services.acm.model.ImportCertificateResponse;


@Service
@RequiredArgsConstructor
public class AwsDeploymentService {

    public String deploy(String certificate, String privateKey) {
        try {
            ProfileCredentialsProvider provider = ProfileCredentialsProvider.builder().profileName("cert-manager").build();
            AcmClient acmClient = AcmClient.builder().region(Region.US_EAST_1).credentialsProvider(provider).build();
            ImportCertificateRequest request = ImportCertificateRequest.builder()
                    .certificate(SdkBytes.fromUtf8String(certificate))
                    .privateKey(SdkBytes.fromUtf8String(privateKey))
                    .build();
            ImportCertificateResponse response = acmClient.importCertificate(request);
            return response.certificateArn();
        } catch (Exception e) {
           throw new DeploymentException();
        }
    }
}
