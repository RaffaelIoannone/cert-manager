package io.raffael.cert_manager.controller;

import io.raffael.cert_manager.dto.CertificateDTO;
import io.raffael.cert_manager.dto.CreateCertificateDTO;
import io.raffael.cert_manager.dto.SignCertificateDTO;
import io.raffael.cert_manager.dto.UploadSignedCertificateDTO;
import io.raffael.cert_manager.service.CertificateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import static io.raffael.cert_manager.controller.CertificateController.URL;

@Log
@RestController
@RequestMapping(URL)
@RequiredArgsConstructor
public class CertificateController {

    public static final String URL = "/api/certificates";

    private final CertificateService certificateService;

    @GetMapping
    public List<CertificateDTO> getCertificates(@RequestParam(value = "revoked", required = false, defaultValue = "false") boolean revoked,
                                                @RequestParam(value = "caonly", required = false, defaultValue = "false") boolean caOnly,
                                                @RequestParam(value = "expiring", required = false, defaultValue = "false") boolean expiring,
                                                @RequestParam(value = "keystore", required = false, defaultValue = "false") boolean keystore) {

        return certificateService.getCertificates(revoked, caOnly, expiring, keystore);
    }

    @GetMapping("/{id}")
    public CertificateDTO getCertificate(@PathVariable String id) {
        return certificateService.getCertificate(id);
    }

    @PostMapping
    public ResponseEntity<CertificateDTO> createCertificate(@Valid @RequestBody CreateCertificateDTO dto) throws URISyntaxException {
        CertificateDTO certificate = certificateService.createCertificate(dto);
        return ResponseEntity.created(new URI(STR."\{URL}/\{certificate.getId()}")).body(certificate);
    }

    @PutMapping("/{id}/upload-signed")
    public ResponseEntity<CertificateDTO> uploadSignedCertificate(@PathVariable String id, @Valid @RequestBody UploadSignedCertificateDTO dto) {
        CertificateDTO certificate = certificateService.uploadSignedCertificate(id, dto);
        return ResponseEntity.ok(certificate);
    }

    @PutMapping("/{id}/sign")
    public ResponseEntity<CertificateDTO> signCertificate(@PathVariable String id, @Valid @RequestBody SignCertificateDTO dto) {
        CertificateDTO certificate = certificateService.signCertificate(id, dto);
        return ResponseEntity.ok(certificate);
    }

    @PutMapping("/{id}/revoke")
    public CertificateDTO revokeCertificate(@PathVariable String id) {
        return certificateService.revokeCertificate(id);
    }

    @PostMapping("/{id}/deploy-aws")
    public ResponseEntity<CertificateDTO> deployToAws(@PathVariable String id) {
        CertificateDTO certificate = certificateService.deployToAws(id);
        return ResponseEntity.ok(certificate);
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<CertificateDTO> renewCertificate(@PathVariable String id, @Valid @RequestBody CreateCertificateDTO dto) throws URISyntaxException {
        CertificateDTO certificate = certificateService.renew(id, dto);
        return ResponseEntity.created(new URI(STR."\{URL}/\{certificate.getId()}")).body(certificate);
    }

}
