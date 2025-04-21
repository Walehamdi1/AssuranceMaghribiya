package tn.esprit.contractmanegement.Service;


import org.springframework.stereotype.Service;

@Service
public class SentimentAnalysisService {

    // Méthode pour analyser le sentiment d'un feedback (ici avec une méthode simplifiée)
    public String analyzeSentiment(String feedback) {
        if (feedback == null || feedback.isEmpty()) {
            return "neutre"; // Sentiment neutre si le feedback est vide
        }

        // Logique simple d'analyse (vous pouvez l'améliorer en intégrant un modèle NLP comme VADER ou HuggingFace)
        if (feedback.toLowerCase().contains("mauvais") || feedback.toLowerCase().contains("problème")) {
            return "négatif";
        } else if (feedback.toLowerCase().contains("bien") || feedback.toLowerCase().contains("satisfait")) {
            return "positif";
        }
        return "neutre"; // Par défaut, sentiment neutre
    }
}
