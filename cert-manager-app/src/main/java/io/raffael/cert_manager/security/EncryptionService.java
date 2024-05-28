package io.raffael.cert_manager.security;

import io.raffael.cert_manager.exception.KeystoreLoadingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import java.io.IOException;
import java.security.*;
import java.security.cert.CertificateException;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class EncryptionService {

    private final EncryptionProperties encryptionProperties;
    private SecretKey key = null;
    private SecretKey loadFromKeystore() {
        try {
            KeyStore keyStore = KeyStore.getInstance("pkcs12");
            keyStore.load(encryptionProperties.getKeystore().getInputStream(), encryptionProperties.getPassword().toCharArray());
            return (SecretKey) keyStore.getKey(encryptionProperties.getAlias(), encryptionProperties.getPassword().toCharArray());
        } catch (UnrecoverableKeyException | CertificateException | KeyStoreException | IOException |
                 NoSuchAlgorithmException e) {
            throw new KeystoreLoadingException();
        }
    }

    private SecretKey getKey() {
        if (key != null) {
            return key;
        } else {
            key = loadFromKeystore();
            return key;
        }
    }

    private IvParameterSpec generateIv() {
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        return new IvParameterSpec(iv);
    }

    public String encrypt(String input) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, getKey(), generateIv());
            byte[] cipherText = cipher.doFinal(input.getBytes());
            String cipherString = Base64.getEncoder().encodeToString(cipherText);
            String ivString = Base64.getEncoder().encodeToString(cipher.getIV());
            return STR."{cipher}@@\{ivString}@@\{cipherString}";
        } catch (NoSuchPaddingException | NoSuchAlgorithmException | InvalidKeyException | IllegalBlockSizeException |
                 BadPaddingException |InvalidAlgorithmParameterException e) {
            throw new RuntimeException(e);
        }
    }

    public String decrypt(String input) {
        try {
            if (input.startsWith("{cipher}")) {
                String[] parts = input.split("@@");
                byte[] iv = Base64.getDecoder().decode(parts[1]);
                IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);
                byte[] cipherText = Base64.getDecoder().decode(parts[2]);
                Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
                cipher.init(Cipher.DECRYPT_MODE, getKey(),ivParameterSpec);
                byte[] plainText = cipher.doFinal(cipherText);
                return new String(plainText);
            }
            return input;

        } catch (NoSuchPaddingException | NoSuchAlgorithmException | InvalidAlgorithmParameterException |
                 BadPaddingException | IllegalBlockSizeException | InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }
}
