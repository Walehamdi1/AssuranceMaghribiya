package tn.esprit.contractmanegement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.Consultation;

import java.time.LocalDate;
import java.util.List;

@Service
public class ConsultationScheduler {

    @Autowired
    private ConsultationService consultationService;

    @Autowired
    private EmailServiceC emailService;

    @Scheduled(cron = "0 * * * * ?")
    public void sendRatingRequests() {
        LocalDate today = LocalDate.now();
        List<Consultation> consultations = consultationService.getConsultationsByDate(today.minusDays(1).atStartOfDay());  // Consulter celles d'hier

        System.out.println("Consultations récupérées : " + consultations.size()); // Log pour vérifier la récupération des consultations

        for (Consultation consultation : consultations) {
            if (consultation.getClient() != null && consultation.getClient().getEmail() != null) {
                System.out.println("Envoi de l'email à : " + consultation.getClient().getEmail()); // Log pour vérifier l'envoi de l'email
                emailService.sendRatingEmail(consultation.getClient().getEmail(), consultation.getId());
            }
        }
    }
}
