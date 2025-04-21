package tn.esprit.contractmanegement.Service;

import org.springframework.stereotype.Service;

@Service
public class ClaimAnalysisService {

    // Méthode pour compter les mots dans une description
    public int countWords(String description) {
        if (description == null || description.trim().isEmpty()) {
            return 0;
        }
        return description.trim().split("\\s+").length;
    }

    // Méthode pour estimer le temps moyen de traitement en minutes
    public int estimateProcessingTime(String description) {
        int wordCount = countWords(description);

        // Heuristique simple : 2 minutes par 10 mots
        int estimatedTime = (int) Math.ceil((double) wordCount / 10) * 2;

        // Valeur minimum de 2 minutes si très courte
        return Math.max(estimatedTime, 2);
    }
}