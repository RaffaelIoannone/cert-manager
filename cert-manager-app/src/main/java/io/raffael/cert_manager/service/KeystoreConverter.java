package io.raffael.cert_manager.service;

import io.raffael.cert_manager.dto.CertificateReferenceDTO;
import io.raffael.cert_manager.dto.KeystoreDTO;
import io.raffael.cert_manager.dto.KeystoreEntryDTO;
import io.raffael.cert_manager.exception.ObjectNotFoundException;
import io.raffael.cert_manager.model.Certificate;
import io.raffael.cert_manager.model.Keystore;
import io.raffael.cert_manager.model.KeystoreEntry;
import io.raffael.cert_manager.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class KeystoreConverter {

    private final CertificateRepository certificateRepository;
    private final CertificateConverter certificateConverter;

    public KeystoreDTO convert(Keystore keystore) {
        if (keystore == null) {
            return null;
        }
        List<KeystoreEntryDTO> entries = keystore.getEntries().stream().map(this::convert).collect(Collectors.toList());
        return KeystoreDTO.builder()
                .id(keystore.getId())
                .name(keystore.getName())
                .description(keystore.getDescription())
                .entries(entries)
                .build();
    }

    private KeystoreEntryDTO convert(KeystoreEntry keystoreEntry) {
        if (keystoreEntry == null) {
            return null;
        }

        Certificate certificate = certificateRepository.findById(keystoreEntry.getCertificateId()).orElseThrow(ObjectNotFoundException::new);
        CertificateReferenceDTO referenceDTO = certificateConverter.convertToReference(certificate);

        return KeystoreEntryDTO.builder()
                .alias(keystoreEntry.getAlias())
                .type(keystoreEntry.getType())
                .includeRootCA(keystoreEntry.getIncludeRootCA())
                .certificate(referenceDTO)
                .build();
    }
}
