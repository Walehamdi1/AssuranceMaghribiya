package tn.esprit.contractmanegement.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import tn.esprit.contractmanegement.Entity.Client;
import tn.esprit.contractmanegement.Entity.Consultation;
import tn.esprit.contractmanegement.Enumeration.StatusConsultation;
import tn.esprit.contractmanegement.Repository.ClientRepository;
import tn.esprit.contractmanegement.Repository.ConsultationRepository;
import tn.esprit.contractmanegement.Repository.ExpertRepository;
import tn.esprit.contractmanegement.Service.ConsultationService;
import tn.esprit.contractmanegement.Service.EmailService;
import tn.esprit.contractmanegement.Service.EmailServiceC;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "http://localhost:4200")

public class ConsultationController {

    private final ConsultationService consultationService;
    private final ClientRepository clientRepository;
    private final ConsultationRepository consultationRepository;


    @Autowired
    private EmailServiceC emailService;

    @Autowired
    private ExpertRepository expertRepository;

    @Autowired
    public ConsultationController(ConsultationService consultationService, ClientRepository clientRepository, ConsultationRepository consultationRepository) {
        this.consultationService = consultationService;
        this.clientRepository = clientRepository;
        this.consultationRepository = consultationRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Consultation> createConsultation(@RequestBody Map<String, Object> payload) {
        try {
            Consultation consultation = new Consultation();
            consultation.setObjet((String) payload.get("objet"));
            consultation.setDescription((String) payload.get("description"));


            String rawDate = (String) payload.get("dateConsultation");
            try {
                consultation.setDateConsultation(LocalDateTime.parse(rawDate));
            } catch (DateTimeParseException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }


            Map<String, Object> clientPayload = (Map<String, Object>) payload.get("client");
            if (clientPayload == null || clientPayload.get("id") == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Retourne une erreur si l'ID du client est absent
            }
            Long clientId = ((Number) clientPayload.get("id")).longValue();


            Optional<Client> clientOpt = clientRepository.findById(clientId);
            if (clientOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            consultation.setClient(clientOpt.get());


            consultation.setStatut("EN_COURS");

            Consultation savedConsultation = consultationService.saveConsultation(consultation);
            return ResponseEntity.ok(savedConsultation);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping
    public ResponseEntity<List<Consultation>> getAllConsultations() {
        List<Consultation> consultations = consultationService.getAllConsultations();
        consultations.forEach(consultation -> System.out.println("Statut : " + consultation.getStatut()));
        return ResponseEntity.ok(consultations);
    }


    @PutMapping("/{id}/statut")
    public ResponseEntity<Consultation> updateStatut(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String statutReçu = request.get("statut");
        System.out.println("Statut reçu : " + statutReçu);
        Optional<Consultation> consultationOptional = consultationService.getConsultationById(id);
        if (consultationOptional.isPresent()) {
            try {
                Consultation consultation = consultationOptional.get();
                StatusConsultation statut = StatusConsultation.valueOf(statutReçu.toUpperCase()); // Respect de la casse
                consultation.setStatut(String.valueOf(statut));
                Consultation updatedConsultation = consultationService.saveConsultation(consultation);
                return ResponseEntity.ok(updatedConsultation);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Erreur sur la valeur du statut
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        if (consultationService.getConsultationById(id).isPresent()) {
            consultationService.deleteConsultation(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{consultationId}/assign-expert")
    public ResponseEntity<Consultation> assignExpertToConsultation(
            @PathVariable Long consultationId, @RequestBody Map<String, Long> body) {
        Long expertId = body.get("expertId");
        Consultation consultation = consultationService.getConsultationById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        LocalDateTime consultationDate = consultation.getDateConsultation();

        if (!consultationService.checkExpertAvailability(expertId, consultation)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        consultation.setExpert(expertRepository.findById(expertId)
                .orElseThrow(() -> new RuntimeException("Expert not found")));

        consultation = consultationRepository.save(consultation);

        return ResponseEntity.ok(consultation);
    }


    @PutMapping("/{id}/accepter")
    public ResponseEntity<Consultation> acceptConsultation(@PathVariable Long id) {
        Optional<Consultation> consultationOptional = consultationService.getConsultationById(id);
        if (consultationOptional.isPresent()) {
            Consultation consultation = consultationOptional.get();
            consultation.setStatut("VALIDÉE");
            consultationService.saveConsultation(consultation);
            return ResponseEntity.ok(consultation);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Integer>> getConsultationStatistics() {
        try {
            Map<String, Integer> stats = consultationService.getConsultationStatistics();  // Appel au service
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // En cas d'erreur, retourne une erreur 500
        }
    }

//    @GetMapping("/statistics")
//    public ResponseEntity<Map<String, Object>> getStatistics(
//            @RequestParam(required = false) String period, // "month", "year", ou null pour tout
//            @RequestParam(required = false) Integer year,
//            @RequestParam(required = false) Integer month) {
//
//        Map<String, Object> stats = consultationService.getStatistics(period, year, month);
//        return ResponseEntity.ok(stats);
//    }


//    @GetMapping("/search")
//    public ResponseEntity<List<Consultation>> searchConsultations(
//            @RequestParam(required = false) String statut,
//            @RequestParam(required = false) String objet) {
//
//        List<Consultation> consultations = consultationService.searchConsultations(objet, statut);
//        return ResponseEntity.ok(consultations);
//    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultationById(@PathVariable Long id) {
        Optional<Consultation> consultationOptional = consultationService.getConsultationById(id);
        return consultationOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/submitRating/{consultationId}")
    public ResponseEntity<String> submitRating(@PathVariable Long consultationId,
                                               @RequestParam int rating,
                                               @RequestParam String comment) {
        Optional<Consultation> consultationOpt = consultationRepository.findById(consultationId);
        if (consultationOpt.isPresent()) {
            Consultation consultation = consultationOpt.get();
            consultation.setRating(rating);
            consultation.setComment(comment);


            consultationRepository.save(consultation);


            sendAdminNotification(consultation);
            return ResponseEntity.ok("Avis soumis avec succès !");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Consultation non trouvée");
        }
    }

    @GetMapping("/yesterday")
    public ResponseEntity<List<Consultation>> getConsultationsFromYesterday() {
        List<Consultation> consultations = consultationService.getConsultationsByYesterday();
        return ResponseEntity.ok(consultations);
    }

    private void sendAdminNotification(Consultation consultation) {
        String adminEmail = "Maryemrah788@gmail.com";
        String subject = "Nouvel avis sur une consultation";

        String emailContent = "<html>"
                + "<body>"
                + "<h2>Nouvel Avis sur une Consultation</h2>"
                + "<p>Bonjour,</p>"
                + "<p>Un client a soumis un avis pour la consultation suivante :</p>"
                + "<table style='border: 1px solid #ddd; border-collapse: collapse;'>"
                + "<tr><th style='text-align: left; padding: 8px; background-color: #f4f4f4;'>Objet</th><td style='padding: 8px;'>" + consultation.getObjet() + "</td></tr>"
                + "<tr><th style='text-align: left; padding: 8px; background-color: #f4f4f4;'>Note</th><td style='padding: 8px;'>" + consultation.getRating() + "/5</td></tr>"
                + "<tr><th style='text-align: left; padding: 8px; background-color: #f4f4f4;'>Commentaire</th><td style='padding: 8px;'>" + consultation.getComment() + "</td></tr>"
                + "</table>"
                + "<p>Veuillez consulter cet avis dans votre espace administrateur pour plus de détails.</p>"
                + "<p>Merci pour votre attention.</p>"
                + "<hr>"
                + "<p>Cordialement,</p>"
                + "<p>L'équipe de Gestion des Consultations</p>"
                + "</body>"
                + "</html>";

        emailService.sendEmail(new String[]{adminEmail}, subject, emailContent);
    }


    @GetMapping("/rating-form")
    public String showRatingForm(@RequestParam Long consultationId, Model model) {
        model.addAttribute("consultationId", consultationId);
        return "rating-form";
    }

    @GetMapping("/expert/{expertId}")
    public ResponseEntity<List<Consultation>> getConsultationsByExpert(@PathVariable Long expertId) {
        List<Consultation> consultations = consultationService.getConsultationsByExpertId(expertId);
        if (consultations.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(consultations);
        }
    }



}
