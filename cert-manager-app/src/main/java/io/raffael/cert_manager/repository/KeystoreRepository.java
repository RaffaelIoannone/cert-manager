package io.raffael.cert_manager.repository;


import io.raffael.cert_manager.model.Keystore;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface KeystoreRepository extends MongoRepository<Keystore, String> {
}
