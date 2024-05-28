package io.raffael.cert_manager.controller;

import io.raffael.cert_manager.dto.CreateKeystoreDTO;
import io.raffael.cert_manager.dto.CreateKeystoreFileDTO;
import io.raffael.cert_manager.dto.KeystoreDTO;
import io.raffael.cert_manager.service.KeystoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import static io.raffael.cert_manager.controller.KeystoreController.URL;

@Log
@RestController
@RequestMapping(URL)
@RequiredArgsConstructor
public class KeystoreController {

    public static final String URL = "/api/keystores";

    private final KeystoreService keystoreService;

    @GetMapping
    public List<KeystoreDTO> getKeystores() {
        return keystoreService.getKeystores();
    }

    @GetMapping("/{id}")
    public KeystoreDTO getKeystore(@PathVariable String id) {
        return keystoreService.getKeystore(id);
    }

    @PostMapping
    public ResponseEntity<KeystoreDTO> createKeystore(@Valid @RequestBody CreateKeystoreDTO dto) throws URISyntaxException {
        KeystoreDTO keystore = keystoreService.createKeystore(dto);
        return ResponseEntity.created(new URI(STR."\{URL}/\{keystore.getId()}")).body(keystore);
    }

    @PostMapping("/{id}/file")
    public ResponseEntity<Resource> createTruststoreFile(@PathVariable String id, @Valid @RequestBody CreateKeystoreFileDTO dto) {
        ByteArrayResource file = keystoreService.createKeystoreFile(id, dto);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(file.contentLength())
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(dto.getFilename()).build().toString())
                .body(file);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteKeystore(@PathVariable String id) {
        keystoreService.deleteKeystore(id);
        return ResponseEntity.ok().build();
    }

}
