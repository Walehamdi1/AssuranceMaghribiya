package tn.esprit.contractmanegement.Service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReclamationResponseService {

    private final Map<String, List<String>> keywordMap = new HashMap<>();
    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${keywords.file.path:keywords.json}")
    private String keywordsFilePath;

    @Autowired
    public ReclamationResponseService(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostConstruct
    public void init() {
        loadKeywords();
    }

    public void loadKeywords() {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(keywordsFilePath)) {
            if (inputStream == null) {
                throw new IllegalStateException("Le fichier " + keywordsFilePath + " n'a pas été trouvé.");
            }

            JsonNode rootNode = objectMapper.readTree(inputStream);
            keywordMap.clear();

            rootNode.fieldNames().forEachRemaining(fieldName -> {
                List<String> keywords = new ArrayList<>();
                rootNode.get(fieldName).forEach(keywordNode -> keywords.add(keywordNode.asText()));
                keywordMap.put(fieldName, keywords);
            });

            System.out.println("Mots-clés chargés avec succès !");
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors du chargement du fichier JSON des mots-clés", e);
        }
    }

    public String generateResponse(String description, String email) {
        description = description.toLowerCase();
        String responseMessage = "Merci d'avoir soumis votre réclamation. Nous allons l'examiner et vous contacter sous peu.";

        for (Map.Entry<String, List<String>> entry : keywordMap.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (description.contains(keyword)) {
                    responseMessage = generateResponseBasedOnCategory(entry.getKey());
                    break;
                }
            }
        }

        // Envoyer l'email après génération de la réponse
        sendResponseByEmail(email, responseMessage);
        return responseMessage;
    }

    private String generateResponseBasedOnCategory(String category) {
        return switch (category) {
            case "retard" -> "Nous avons pris en compte votre réclamation concernant le retard. Notre équipe travaille à résoudre ce problème.";
            case "problème technique" -> "Votre réclamation concernant un problème technique a été bien reçue. Nos techniciens vous contacteront sous peu.";
            case "facture" -> "Votre réclamation concernant une erreur de facturation a été enregistrée. Nous allons vérifier cela immédiatement.";
            case "service client" -> "Nous avons pris en compte votre demande concernant notre service client. Un représentant vous contactera sous peu.";
            case "annulation" -> "Votre demande d'annulation a été reçue. Nous allons traiter votre dossier et vous envoyer une confirmation.";
            case "remboursement" -> "Votre demande de remboursement a été bien reçue. Nous allons traiter cela dans les plus brefs délais.";
            default -> "Merci d'avoir soumis votre réclamation. Nous allons l'examiner et vous contacter sous peu.";
        };
    }

    private void sendResponseByEmail(String recipientEmail, String responseMessage) {
        if (recipientEmail != null && !recipientEmail.isEmpty()) {


            try {
                emailService.sendEmail(recipientEmail,"Reclamation","Bonjour,\n\n" + responseMessage + "\n\nCordialement,\nL'équipe Support");
                System.out.println("Email envoyé avec succès à " + recipientEmail);
            } catch (Exception e) {
                System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
            }
        } else {
            System.err.println("Email non envoyé : adresse email manquante.");
        }
    }
    public String generateResponse(String description) {
        return generateResponse(description, "");
    }

}

