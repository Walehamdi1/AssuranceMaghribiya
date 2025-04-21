package tn.esprit.contractmanegement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.contractmanegement.Entity.Appointement;
import tn.esprit.contractmanegement.Entity.User;

import java.time.LocalDate;
import java.util.List;

public interface AppointementRepository extends JpaRepository<Appointement, Long> {  // Renvoie uniquement les appointments à afficher (archiver = true)

    List<Appointement> findByUser(User user);
    List<Appointement> findByArchiverTrue();
    @Query("SELECT COUNT(a) FROM Appointement a WHERE FUNCTION('DATE', a.dateSubmitted) = :date")
    long countByDateSubmitted(@Param("date") LocalDate date);
    List<Appointement> findByStatus(String status);
    List<Appointement> findByArchiverFalse(); // archived

}
