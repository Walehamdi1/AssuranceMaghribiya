package tn.esprit.contractmanegement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.contractmanegement.Entity.Sinister;
import tn.esprit.contractmanegement.Entity.User;
import tn.esprit.contractmanegement.Enumeration.Status;

import java.util.List;

@Repository
public interface SinisterRepository extends JpaRepository<Sinister, Long> {
    List<Sinister> findByStatus(Status status);

    @Query("SELECT s FROM Sinister s")
    List<Sinister> findAllWithUser();

    @Query(value = "SELECT AVG(TIMESTAMPDIFF(SECOND, dateofcreation, processed_date)) " +
            "FROM sinisters " +
            "WHERE type_insurance = :typeInsurance " +
            "AND status IN ('ACCEPTED', 'DECLINED') " +
            "AND processed_date IS NOT NULL", nativeQuery = true)
    Double findAverageProcessingTimeByTypeInsurance(@Param("typeInsurance") String typeInsurance);

    List<Sinister> findByUser(Long userId);

}

