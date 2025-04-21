package tn.esprit.contractmanegement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.contractmanegement.Entity.Devis;
import tn.esprit.contractmanegement.Entity.User;

import java.util.List;


@Repository
public interface DevisRepository extends JpaRepository<Devis,Long> {
    List<Devis> findByUser(User user);

}
