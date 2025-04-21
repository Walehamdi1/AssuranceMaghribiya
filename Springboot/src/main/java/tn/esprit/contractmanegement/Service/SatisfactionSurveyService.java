package tn.esprit.contractmanegement.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.SatisfactionSurvey;
import tn.esprit.contractmanegement.Repository.SatisfactionSurveyRepository;

@Service
public class SatisfactionSurveyService {

    private final SatisfactionSurveyRepository satisfactionSurveyRepository;
    private final SentimentAnalysisService sentimentAnalysisService;

    @Autowired
    public SatisfactionSurveyService(SatisfactionSurveyRepository satisfactionSurveyRepository,
                                     SentimentAnalysisService sentimentAnalysisService) {
        this.satisfactionSurveyRepository = satisfactionSurveyRepository;
        this.sentimentAnalysisService = sentimentAnalysisService;
    }

    // Méthode pour sauvegarder l'enquête de satisfaction avec l'analyse de sentiment
    public void saveSatisfactionSurvey(SatisfactionSurvey survey) {
        // Analyser le sentiment du feedback
        String sentiment = sentimentAnalysisService.analyzeSentiment(survey.getFeedback());

        // Sauvegarder l'analyse de sentiment dans l'objet SatisfactionSurvey
        survey.setSentimentAnalysis(sentiment);

        // Sauvegarder l'enquête dans la base de données
        satisfactionSurveyRepository.save(survey);
    }
}
