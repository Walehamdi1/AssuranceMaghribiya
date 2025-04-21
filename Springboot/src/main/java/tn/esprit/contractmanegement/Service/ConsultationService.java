package tn.esprit.contractmanegement.Service;


import com.twilio.base.Page;
import org.springframework.data.domain.Pageable;
import tn.esprit.contractmanegement.Entity.Consultation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ConsultationService {
    Consultation saveConsultation(Consultation consultation);

    List<Consultation> getAllConsultations();

    Optional<Consultation> getConsultationById(Long id);

    void deleteConsultation(Long id);

    List<Consultation> getConsultationsByClientId(Long clientId);


    //List<Consultation> searchConsultations(String objet, String statut);

    List<Consultation> filterConsultations(String statut, String dateConsultation, Long clientId);

    Consultation assignExpert(Long consultationId, Long expertId);

    //Page<Consultation> getAllConsultationsSortedByStatut(Pageable pageable);


    Map<String, Long> getConsultationStat();

    Map<String, Integer> getConsultationStatistics();

    List<Consultation> getConsultationsByDate(LocalDateTime localDate);

    List<Consultation> getAcceptedConsultationsWithPassedDate();

    List<Consultation> getConsultationsByYesterday();

//    void save(Consultation consultation);

    Consultation findById(Long consultationId);

    boolean checkExpertAvailability(Long expertId, Consultation consultationDate);

    void save(Consultation consultation);

    List<Consultation> getConsultationsByExpertId(Long expertId);

//    Map<String, Object> getStatistics(String period, Integer year, Integer month);

//    Map<String, Map<String, Long>> getConsultationStatisticsByPeriod(LocalDateTime startDate, LocalDateTime endDate);

//    boolean checkExpertAvailability(Long expertId, LocalDateTime consultationDate);
}

