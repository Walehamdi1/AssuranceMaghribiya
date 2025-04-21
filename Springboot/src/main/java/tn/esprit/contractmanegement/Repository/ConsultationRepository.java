package tn.esprit.contractmanegement.Repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.contractmanegement.Entity.Consultation;
import tn.esprit.contractmanegement.Entity.Expert;
import tn.esprit.contractmanegement.Enumeration.StatusConsultation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {


    List<Consultation> findByClientId(Long clientId);

    List<Consultation> findByObjetContaining(String objet);

    List<Consultation> findByStatut(String statut);

    List<Consultation> findByExpertId(Long expertId);


//    List<Consultation> findByStatutAndDateConsultationBefore(String statut, LocalDate date);

    @Query("SELECT c FROM Consultation c WHERE " +
            "(:statut IS NULL OR c.statut = :statut) AND " +
            "(:dateConsultation IS NULL OR c.dateConsultation = :dateConsultation) AND " +
            "(:clientId IS NULL OR c.client.id = :clientId)")
    List<Consultation> findByFilters(
            @Param("statut") String statut,
            @Param("dateConsultation") LocalDate dateConsultation,
            @Param("clientId") Long clientId
    );

    @Query("SELECT c.insuranceType, COUNT(c) FROM Consultation c GROUP BY c.insuranceType")
    List<Object[]> countByInsuranceType();

    @Query("SELECT c FROM Consultation c ORDER BY CASE WHEN c.statut = 'EN_COURS' THEN 1 ELSE 2 END, c.dateConsultation DESC")
    Page<Consultation> findAllSortedByStatut(Pageable pageable);

    @Query("SELECT c.statut, COUNT(c) FROM Consultation c GROUP BY c.statut")
    List<Object[]> countConsultationsByStatut();

    @Query("SELECT c FROM Consultation c WHERE c.statut = :statut")
    List<Consultation> findByStatut(@Param("statut") StatusConsultation statut);


//    List<Consultation> findByDateConsultation(LocalDateTime dateConsultation);


    long countByExpertAndDateConsultationBetween(Expert expert, LocalDateTime startOfDay, LocalDateTime endOfDay);


    List<Consultation> findByDateConsultation(LocalDate localDate);

}

