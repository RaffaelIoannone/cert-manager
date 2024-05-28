package io.raffael.cert_manager.service;

import io.raffael.cert_manager.exception.DeserializationException;
import io.raffael.cert_manager.exception.SerializationException;
import io.raffael.cert_manager.model.Algorithm;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;
import org.bouncycastle.util.io.pem.PemWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

@Service
public class PemConverter {

    private String writeToPem(String pemType, byte[] content) throws IOException {
        StringWriter stringWriter = new StringWriter();
        try (PemWriter pemWriter = new PemWriter(stringWriter)) {
            pemWriter.writeObject(new PemObject(pemType, content));
        }
        return stringWriter.toString();
    }

    public String certificateToPem(X509Certificate certificate) {
        try {
            return writeToPem("CERTIFICATE", certificate.getEncoded());
        } catch (CertificateEncodingException | IOException e) {
            throw new SerializationException();
        }
    }

    public String csrToPem(PKCS10CertificationRequest csr) {
        try {
            return writeToPem("CERTIFICATE REQUEST", csr.getEncoded());
        } catch (IOException e) {
            throw new SerializationException();
        }
    }

    public String privateKeyToPem(PrivateKey privateKey) {
        try {
            return writeToPem("PRIVATE KEY", privateKey.getEncoded());
        } catch (IOException e) {
            throw new SerializationException();
        }
    }

    public String publicKeyToPem(PublicKey publicKey) {
        try {
            return writeToPem("PUBLIC KEY", publicKey.getEncoded());
        } catch (IOException e) {
            throw new SerializationException();
        }
    }

    private byte[] deserializePem(String pem) throws IOException {
        PemReader pemReader = new PemReader(new StringReader(pem));
        byte[] content = pemReader.readPemObject().getContent();
        pemReader.close();
        return content;
    }

    public PrivateKey deserializePrivateKey(Algorithm algorithm, String pem) {
        try {
            byte[] content = deserializePem(pem);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(content);
            KeyFactory keyFactory = KeyFactory.getInstance(algorithm.toString());
            return keyFactory.generatePrivate(spec);
        } catch (IOException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new DeserializationException();
        }
    }

    public PublicKey deserializePublicKey(Algorithm algorithm, String pem) {
        try {
            byte[] content = deserializePem(pem);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(content);
            KeyFactory keyFactory = KeyFactory.getInstance(algorithm.toString());
            return keyFactory.generatePublic(spec);
        } catch (IOException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new DeserializationException();
        }
    }

    public X509Certificate deserializeCertificate(String pem) {
        try {
            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            return (X509Certificate) certificateFactory.generateCertificate(new ByteArrayInputStream(pem.getBytes()));
        } catch (CertificateException e) {
            throw new DeserializationException();
        }
    }

    public PKCS10CertificationRequest deserializeCsr(String pem) {
        try {
            byte[] content = deserializePem(pem);
            return new PKCS10CertificationRequest(content);
        } catch (IOException e) {
            throw new DeserializationException();
        }
    }

}
