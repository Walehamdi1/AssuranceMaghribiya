package tn.esprit.contractmanegement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.contractmanegement.Entity.Client;

@Repository

public interface ClientRepository extends JpaRepository<Client, Long> {
    boolean existsByEmail(String email);
}
