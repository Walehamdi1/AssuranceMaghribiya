package tn.esprit.contractmanegement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Enumeration.ClaimStatus;
import tn.esprit.contractmanegement.Entity.Claims;
import tn.esprit.contractmanegement.Entity.User;
import tn.esprit.contractmanegement.Enumeration.ReclamationType;
import tn.esprit.contractmanegement.Repository.ClaimsRepository;
import tn.esprit.contractmanegement.Repository.SatisfactionSurveyRepository;

import java.util.*;

@Service
public class ClaimsService implements IClaimsService {

    private final ClaimsRepository claimsRepository;
    private final EmailService emailService; // Ajoutez cette variable
    private final SatisfactionSurveyRepository satisfactionSurveyRepository;
    private final UserService userService;

    @Autowired
    public ClaimsService(ClaimsRepository claimsRepository, EmailService emailService, SatisfactionSurveyRepository satisfactionSurveyRepository, UserService userService) {

        this.claimsRepository = claimsRepository;
        this.emailService = emailService; // Injection de EmailService
        this.satisfactionSurveyRepository = satisfactionSurveyRepository;
        this.userService = userService;
    }

    // Définir des descriptions prédéfinies par type de réclamation
    private static final Map<ReclamationType, List<String>> predefinedDescriptions = new HashMap<>() {{
        put(ReclamationType.SERVICE, List.of(
                "The advisor was not responsive to my request.",
                "The customer support service is hard to reach.",
                "I did not receive the information I requested regarding my contract."
        ));
        put(ReclamationType.QUALITY, List.of(
                "The insurance product does not meet my expectations.",
                "The contract does not meet the criteria outlined in the documentation.",
                "The insurance coverage is insufficient."
        ));
        put(ReclamationType.DELAY, List.of(
                "I have not received my contract within the promised timeframe.",
                "The reimbursement for my claim is taking too long.",
                "The processing of my file is too slow."
        ));
        put(ReclamationType.OTHER, List.of(
                "I have a question regarding the cancellation of my contract.",
                "I would like more information about modifying my insurance policy.",
                "I am facing a technical issue on your online platform."
        ));
    }};


    // Méthode pour obtenir les descriptions prédéfinies en fonction du type
    public List<String> getPredefinedDescriptions(ReclamationType type) {
        return predefinedDescriptions.getOrDefault(type, new ArrayList<>());
    }

    private int calculateEstimatedProcessingTime(String description) {
        int wordCount = description.trim().split("\\s+").length;

        if (wordCount <= 20) return 1;
        else if (wordCount <= 50) return 2;
        else return 3; // ou tu peux utiliser une formule dynamique
    }




    // ✅ Create a claim
    @Override
    public Claims createClaim(Claims claim) {
        User user = userService.getCurrentUser();
        claim.setUser(user);
        int estimatedTime = calculateEstimatedProcessingTime(claim.getDescription());
        claim.setEstimatedProcessingTime(estimatedTime);
        return claimsRepository.save(claim);
    }

    public List<Claims> getClaimsByUserId() {
        User currentUser = userService.getCurrentUser();
        return claimsRepository.findByUser(currentUser);
    }


    // ✅ Get all claims
    @Override
    public List<Claims> getAllClaims() {
        List<Claims> claims = claimsRepository.findAll();
        return claims.isEmpty() ? new ArrayList<>() : claims;
    }

    // ✅ Get a claim by ID
    @Override
    public Optional<Claims> getClaimById(Long id) {
        return claimsRepository.findById(id);
    }

    // ✅ Update claim

    @Override
    public Claims updateClaim(Long claimId, Claims updatedClaim) {
        return claimsRepository.findById(claimId).map(existingClaim -> {
            existingClaim.setReclamationType(updatedClaim.getReclamationType());
            existingClaim.setReclamationDate(updatedClaim.getReclamationDate());
            existingClaim.setDescription(updatedClaim.getDescription());
            existingClaim.setStatus(updatedClaim.getStatus());
            Claims savedClaim = claimsRepository.save(existingClaim);

            // Si le statut devient TRAITEE, envoyer l'enquête de satisfaction
            if (savedClaim.getStatus() == ClaimStatus.TRAITEE) {
                sendSatisfactionSurvey(savedClaim);
            }

            return savedClaim;
        }).orElseThrow(() -> new RuntimeException("Claim not found"));
    }

    private void sendSatisfactionSurvey(Claims claim) {
        // Vérifier que l'email de l'utilisateur est disponible
        if (claim.getUser() != null && claim.getUser().getEmail() != null) {
            String recipient = claim.getUser().getEmail();
            String subject = "Enquête de satisfaction pour votre réclamation";
            String body = "Bonjour " + claim.getUser().getUsername() + ",\n\n"
                    + "Nous aimerions connaître votre satisfaction concernant le traitement de votre réclamation.\n"
                    + "Veuillez répondre à cette enquête en cliquant sur le lien suivant : \n"
                    + "https://exemple.com/enquete?id=" + claim.getIdClaim() + "\n\n"
                    + "Cordialement,\nVotre équipe";


            try {
                emailService.sendEmail(recipient,subject,body);
                System.out.println("Enquête envoyée avec succès à " + recipient);
            } catch (Exception e) {
                System.err.println("Erreur lors de l'envoi de l'enquête : " + e.getMessage());
            }
        } else {
            System.err.println("Email non envoyé : utilisateur ou email manquant.");
        }
    }

    @Override
    public void deleteClaim(Long id) {
        if (!claimsRepository.existsById(id)) {
            throw new RuntimeException("Claim not found");
        }
        claimsRepository.deleteById(id);
    }

    private void sendEmailWithMeetLink(Claims claim) {
        // Vérifiez que l'utilisateur et son email sont renseignés
        if (claim.getUser() != null && claim.getUser().getEmail() != null) {
            String recipient = claim.getUser().getEmail();
            String subject = "Votre réclamation a été traitée";
            String meetLink = "https://meet.google.com/xxx-xxxx-xxx"; // Remplacez par le lien Meet réel
            String body = "Bonjour " + claim.getUser().getUsername() + ",\n\n"
                    + "Votre réclamation a été traitée avec succès.\n"
                    + "Veuillez rejoindre la réunion via le lien suivant: " + meetLink + "\n\n"
                    + "Cordialement,\nVotre équipe";

            try {
                emailService.sendEmail(recipient,subject,body);
                System.out.println("Email envoyé avec succès à " + recipient);
            } catch (Exception e) {
                System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
            }
        } else {
            System.err.println("Email non envoyé: utilisateur ou email manquant.");
        }
    }


}