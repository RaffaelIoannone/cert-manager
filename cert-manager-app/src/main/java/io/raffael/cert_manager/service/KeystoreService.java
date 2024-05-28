package io.raffael.cert_manager.service;

import io.raffael.cert_manager.dto.CreateKeystoreDTO;
import io.raffael.cert_manager.dto.CreateKeystoreFileDTO;
import io.raffael.cert_manager.dto.KeystoreDTO;
import io.raffael.cert_manager.exception.ObjectNotFoundException;
import io.raffael.cert_manager.model.Certificate;
import io.raffael.cert_manager.model.Keystore;
import io.raffael.cert_manager.model.KeystoreEntry;
import io.raffael.cert_manager.repository.CertificateRepository;
import io.raffael.cert_manager.repository.KeystoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KeystoreService {

    private final KeystoreRepository keystoreRepository;
    private final CertificateRepository certificateRepository;
    private final KeystoreConverter keystoreConverter;
    private final CryptoService cryptoService;

    public List<KeystoreDTO> getKeystores() {
        List<Keystore> keystores = keystoreRepository.findAll();
        return keystores.stream()
                .map(keystoreConverter::convert)
                .collect(Collectors.toList());
    }

    public KeystoreDTO getKeystore(String id) {
        Keystore keystore = keystoreRepository.findById(id).orElseThrow(ObjectNotFoundException::new);
        return keystoreConverter.convert(keystore);
    }

    public KeystoreDTO createKeystore(CreateKeystoreDTO dto) {
        Keystore keystore = Keystore.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .entries(dto.getEntries().stream().map(KeystoreEntry::new).collect(Collectors.toList()))
                .build();
        keystore = keystoreRepository.save(keystore);
        return  keystoreConverter.convert(keystore);
    }

    public ByteArrayResource createKeystoreFile(String id, CreateKeystoreFileDTO dto) {
        Keystore keystore = keystoreRepository.findById(id).orElseThrow(ObjectNotFoundException::new);
        Map<String, Certificate> certificates = keystore.getEntries().stream()
                .map(KeystoreEntry::getCertificateId)
                .distinct()
                .map(certificateRepository::findById)
                .map(entry -> entry.orElseThrow(ObjectNotFoundException::new))
                .collect(Collectors.toMap(Certificate::getId, Function.identity()));
        byte[] file = cryptoService.createKeystoreFile(keystore, dto, certificates);
        return new ByteArrayResource(file);
    }

    public void deleteKeystore(String id) {
        keystoreRepository.deleteById(id);
    }

}
