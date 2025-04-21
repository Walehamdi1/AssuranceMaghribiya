package tn.esprit.contractmanegement.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.contractmanegement.Dto.EmailRequest;
import tn.esprit.contractmanegement.Enumeration.ClaimStatus;
import tn.esprit.contractmanegement.Entity.Claims;
import tn.esprit.contractmanegement.Entity.SatisfactionSurvey;
import tn.esprit.contractmanegement.Enumeration.ReclamationType;
import tn.esprit.contractmanegement.Service.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/claims")
public class ClaimsController {

    private final ClaimsService claimsService;
    private final ReclamationResponseService reclamationResponseService;
    private final SatisfactionSurveyService satisfactionSurveyService;
    private final SentimentAnalysisService sentimentAnalysisService;
    private final ClaimAnalysisService claimAnalysisService;

    public ClaimsController(ClaimsService claimsService, ReclamationResponseService reclamationResponseService, SatisfactionSurveyService satisfactionSurveyService,
                            SentimentAnalysisService sentimentAnalysisService,
                            ClaimAnalysisService claimAnalysisService) {
        this.claimsService = claimsService;
        this.reclamationResponseService = reclamationResponseService;
        this.satisfactionSurveyService = satisfactionSurveyService;
        this.sentimentAnalysisService = sentimentAnalysisService;
        this.claimAnalysisService = claimAnalysisService;
    }

    // ✅ Create a claim
    @PostMapping
    public ResponseEntity<Claims> createClaim(@Valid @RequestBody Claims claim) {
        try {
            if (claim.getStatus() == null) {
                claim.setStatus(ClaimStatus.ENREGISTREE);
            }
            // Enregistrement de la réclamation
            Claims createdClaim = claimsService.createClaim(claim);



            // Traiter la description et envoyer la réponse par email
            reclamationResponseService.generateResponse(createdClaim.getDescription(), createdClaim.getUser().getEmail());


            return ResponseEntity.status(HttpStatus.CREATED).body(createdClaim);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/descriptions/{type}")
    public ResponseEntity<List<String>> getPredefinedDescriptions(@PathVariable ReclamationType type) {
        List<String> descriptions = claimsService.getPredefinedDescriptions(type);
        return ResponseEntity.ok(descriptions);
    }

    // ✅ Get all claims
    @GetMapping
    public ResponseEntity<List<Claims>> getAllClaims() {
        List<Claims> claims = claimsService.getAllClaims();
        return claims.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(claims);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Claims>> getClaimsByUser() {
        List<Claims> claims = claimsService.getClaimsByUserId();
        return claims.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(claims);
    }

    // ✅ Get claim by ID
    @GetMapping("/{id}")
    public ResponseEntity<Claims> getClaimById(@PathVariable Long id) {
        Optional<Claims> claimOptional = claimsService.getClaimById(id);
        return claimOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }





    // ✅ Update claim
    @PutMapping("/{claimId}")
    public ResponseEntity<Claims> updateClaim(@PathVariable Long claimId, @Valid @RequestBody Claims updatedClaim) {
        Optional<Claims> existingClaim = claimsService.getClaimById(claimId);
        if (existingClaim.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Claims claim = claimsService.updateClaim(claimId, updatedClaim);
        return ResponseEntity.ok(claim);
    }

    // ✅ Delete claim
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(@PathVariable Long id) {
        if (claimsService.getClaimById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        claimsService.deleteClaim(id);
        return ResponseEntity.noContent().build(); // ✅ Ensures correct return type
    }

    // ✅ Soumettre une enquête de satisfaction avec analyse de sentiment
    @PostMapping("/survey")
    public ResponseEntity<String> submitSatisfactionSurvey(@RequestBody SatisfactionSurvey survey) {
        try {
            // Analyser le sentiment du feedback avant de sauvegarder
            String sentiment = sentimentAnalysisService.analyzeSentiment(survey.getFeedback());
            survey.setSentimentAnalysis(sentiment); // Ajouter l'analyse de sentiment à l'enquête

            // Sauvegarder l'enquête
            satisfactionSurveyService.saveSatisfactionSurvey(survey);

            return ResponseEntity.ok("Votre enquête de satisfaction a été enregistrée. Merci de votre retour.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'enregistrement de l'enquête.");
        }
    }

    @GetMapping("/analyze/{claimId}")
    public ResponseEntity<String> analyzeClaim(@PathVariable Long claimId) {
        Optional<Claims> claimOptional = claimsService.getClaimById(claimId);
        if (claimOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Réclamation non trouvée");
        }

        Claims claim = claimOptional.get();
        int wordCount = claimAnalysisService.countWords(claim.getDescription());
        float estimatedTime = claimAnalysisService.estimateProcessingTime(claim.getDescription());

        // Utiliser %.2f pour formater le float avec deux décimales
        String analysis = String.format("The total word count in the claim description: %d words. Estimated processing time: %.0f hours.",
                wordCount, estimatedTime);

        return ResponseEntity.ok(analysis);
    }


    @GetMapping("/analyze-description")
    public ResponseEntity<Integer> analyzeDescription(@RequestParam String description) {
        int estimatedTime = claimAnalysisService.estimateProcessingTime(description);
        return ResponseEntity.ok(estimatedTime);
    }

    @PostMapping("/sendEmail")
    public ResponseEntity<Map<String, String>> sendEmail(@RequestBody EmailRequest request) {
        try {
            reclamationResponseService.generateResponse(request.getTo(), request.getBody());
            return ResponseEntity.ok(Map.of("message", "Email sent successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send email."));
        }
    }





}
