package tn.esprit.contractmanegement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.contractmanegement.Entity.SinisterDetail;

import java.util.List;
import java.util.Map;

@Repository
public interface SinisterDetailRepository extends JpaRepository<SinisterDetail, Long> {
    List<SinisterDetail> findBySinister_Id(Long sinisterId);
    List<SinisterDetail> findBySinisterId(Long sinisterId);
    void deleteBySinister_Id(Long sinisterId);

    @Query("SELECT sd FROM SinisterDetail sd " +
            "WHERE sd.status = 'PENDING' " +
            "AND sd.reportedDate = (SELECT MAX(sd2.reportedDate) FROM SinisterDetail sd2 WHERE sd2.sinister.id = sd.sinister.id)")
    List<SinisterDetail> findMostRecentPendingSinisterDetails();

    @Query(value = "SELECT sd.status as status, " +
            "SUM(TIMESTAMPDIFF(SECOND, sd.reported_date, " +
            "   COALESCE((SELECT MIN(sd2.reported_date) " +
            "           FROM sinister_details sd2 " +
            "           WHERE sd2.sinister_id = sd.sinister_id " +
            "           AND sd2.reported_date > sd.reported_date), NOW()))) AS timeSpentInSeconds " +
            "FROM sinister_details sd " +
            "WHERE sd.sinister_id = :sinisterId " +
            "GROUP BY sd.status " +
            "ORDER BY MIN(sd.reported_date)", nativeQuery = true)
    List<Map<String, Object>> calculateTimeSpentInEachStatus(@Param("sinisterId") Long sinisterId);
}
