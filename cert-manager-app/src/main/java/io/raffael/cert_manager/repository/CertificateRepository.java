package io.raffael.cert_manager.repository;

import io.raffael.cert_manager.model.Certificate;
import io.raffael.cert_manager.model.CertificateState;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

public interface CertificateRepository extends MongoRepository<Certificate, String> {

    public List<Certificate> findByStateNot(CertificateState state);

    public List<Certificate> findByState(CertificateState state);

    public List<Certificate> findByStateIn(Collection<CertificateState> state);


    public List<Certificate> findByStateNotInAndCertificateAuthority(Collection<CertificateState> state, Boolean certificateAuthority);

    public List<Certificate> findByStateNotInAndValidUntilBetween(Collection<CertificateState> state, Instant validUntilFrom, Instant validUntilTo);

}
