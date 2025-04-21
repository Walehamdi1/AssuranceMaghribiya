package tn.esprit.contractmanegement.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.Consultation;
import tn.esprit.contractmanegement.Entity.Expert;
import tn.esprit.contractmanegement.Repository.ConsultationRepository;
import tn.esprit.contractmanegement.Repository.ExpertRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ConsultationServiceImp implements ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Lazy
    @Autowired
    private EmailServiceC emailService;

    @Autowired
    private ExpertRepository expertRepository;

    @Override
    public Consultation saveConsultation(Consultation consultation) {
        try {
            if (consultation.getInsuranceType() == null) {
                consultation.setInsuranceType("Type d'assurance par défaut");
            }

            Consultation savedConsultation = consultationRepository.save(consultation);

            if (consultation.getExpert() != null && consultation.getExpert().getEmail() != null) {
                try {
                    String emailContent = "<html>"
                            + "<body>"
                            + "<h2>Nouvelle Consultation Attribuée</h2>"
                            + "<p>Bonjour <strong>" + consultation.getExpert().getNom() + "</strong>,</p>"
                            + "<p>Nous avons le plaisir de vous informer qu'une nouvelle consultation vous a été attribuée :</p>"
                            + "<table>"
                            + "<tr><td><strong>Objet :</strong></td><td>" + consultation.getObjet() + "</td></tr>"
                            + "<tr><td><strong>Description :</strong></td><td>" + consultation.getDescription() + "</td></tr>"
                            + "<tr><td><strong>Date :</strong></td><td>" + consultation.getDateConsultation() + "</td></tr>"
                            + "</table>"
                            + "<p>Veuillez vous connecter à votre espace pour plus de détails et pour prendre en charge cette consultation.</p>"
                            + "<p>Merci de votre collaboration.</p>"
                            + "<hr>"
                            + "<p>Cordialement,</p>"
                            + "<p>L'équipe de Gestion des Consultations</p>"
                            + "</body>"
                            + "</html>";

                    emailService.sendEmail(
                            new String[]{consultation.getExpert().getEmail()},
                            "Nouvelle Consultation Attribuée",
                            emailContent
                    );
                } catch (Exception e) {
                    System.out.println("Erreur lors de l'envoi de l'email à l'expert: " + e.getMessage());
                }
            }


            if (consultation.getClient() != null && consultation.getClient().getEmail() != null) {
                try {
                    String emailContent = "<html>"
                            + "<body>"
                            + "<h2>Confirmation de votre Consultation</h2>"
                            + "<p>Bonjour <strong>" + consultation.getClient().getNom() + "</strong>,</p>"
                            + "<p>Nous vous confirmons que votre consultation a été enregistrée avec succès :</p>"
                            + "<table>"
                            + "<tr><td><strong>Objet :</strong></td><td>" + consultation.getObjet() + "</td></tr>"
                            + "<tr><td><strong>Description :</strong></td><td>" + consultation.getDescription() + "</td></tr>"
                            + "<tr><td><strong>Date :</strong></td><td>" + consultation.getDateConsultation() + "</td></tr>"
                            + "</table>"
                            + "<p>Nous vous tiendrons informé de l'évolution de votre consultation et vous contacterons si nécessaire.</p>"
                            + "<p>Merci de votre confiance.</p>"
                            + "<hr>"
                            + "<p>Cordialement,</p>"
                            + "<p>L'équipe de Gestion des Consultations</p>"
                            + "</body>"
                            + "</html>";

                    emailService.sendEmail(
                            new String[]{consultation.getClient().getEmail()},
                            "Confirmation de votre Consultation",
                            emailContent
                    );
                } catch (Exception e) {
                    System.out.println("Erreur lors de l'envoi de l'email au client: " + e.getMessage());
                }
            }


            return savedConsultation;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la sauvegarde de la consultation", e);
        }
    }

    @Override
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    @Override
    public Optional<Consultation> getConsultationById(Long id) {
        return consultationRepository.findById(id);
    }

    @Override
    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }

    @Override
    public List<Consultation> getConsultationsByClientId(Long clientId) {
        return consultationRepository.findByClientId(clientId);
    }

    @Override
    public List<Consultation> filterConsultations(String statut, String dateConsultation, Long clientId) {
        LocalDate date = (dateConsultation != null && !dateConsultation.isEmpty()) ? LocalDate.parse(dateConsultation) : null;
        return consultationRepository.findByFilters(statut, date, clientId);
    }

    @Override
    public Consultation assignExpert(Long consultationId, Long expertId) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));

        Expert expert = expertRepository.findById(expertId)
                .orElseThrow(() -> new RuntimeException("Expert non trouvé"));

        consultation.setExpert(expert);


        try {
            emailService.sendEmail(
                    new String[]{expert.getEmail()},
                    "Nouvelle consultation assignée",
                    "Bonjour " + expert.getNom() + ",\nVous avez été assigné à la consultation : " + consultation.getObjet()
            );
        } catch (Exception e) {
            System.out.println("Erreur lors de l'envoi de l'email à l'expert : " + e.getMessage());
        }

        return consultationRepository.save(consultation);
    }
/*
    @Override
    public Page<Consultation> getAllConsultationsSortedByStatut(Pageable pageable) {
        return consultationRepository.findAllSortedByStatut(pageable);
    }
*/
    @Override
    public Map<String, Long> getConsultationStat() {
        List<Object[]> results = consultationRepository.countConsultationsByStatut();
        Map<String, Long> stats = new HashMap<>();
        for (Object[] result : results) {
            stats.put((String) result[0], (Long) result[1]);
        }
        return stats;
    }

    @Override
    public Map<String, Integer> getConsultationStatistics() {
        try {
            Map<String, Integer> stats = new HashMap<>();
            List<Object[]> results = consultationRepository.countByInsuranceType();
            for (Object[] result : results) {
                String insuranceType = (String) result[0];
                Long count = (Long) result[1];
                stats.put(insuranceType, count.intValue());
            }
            return stats;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération des statistiques", e);
        }
    }

    @Override
    public List<Consultation> getConsultationsByDate(LocalDateTime localDateTime) {
        return consultationRepository.findByDateConsultation(localDateTime.toLocalDate());
    }


    @Override
    public List<Consultation> getAcceptedConsultationsWithPassedDate() {
        return List.of();
    }

    @Override
    public List<Consultation> getConsultationsByYesterday() {
        return List.of();
    }

//    @Override
//    public void save(Consultation consultation) {
//
//    }

    @Override
    public Consultation findById(Long consultationId) {
        return null;
    }

    @Override
    public boolean checkExpertAvailability(Long id, Consultation consultation) {
        Expert expert = expertRepository.findById(id).orElse(null);
        LocalDate consultationDate = consultation.getDateConsultation().toLocalDate(); // on extrait juste la date (sans l'heure)
        List<Consultation> expertConsultations = expert.getConsultations();

        long consultationsCount = expertConsultations.stream()
                .filter(c -> c.getDateConsultation().toLocalDate().equals(consultationDate))
                .count();

        return consultationsCount < 2;
    }

    @Override
    public void save(Consultation consultation) {

    }

    @Override
    public List<Consultation> getConsultationsByExpertId(Long expertId) {
        return consultationRepository.findByExpertId(expertId);
    }
}
