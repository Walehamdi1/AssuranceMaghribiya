package tn.esprit.contractmanegement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.Consultation;

import java.util.List;

@Service
public class EmailServiceC {

    @Autowired
    private JavaMailSender mailSender;

    private ConsultationService consultationService;

    @Autowired
    public void setConsultationService(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }



    public void sendEmail(String[] to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("Maryemrah788@gmail.com"); // Assurez-vous que c'est le même que dans application.properties
            message.setTo(to); // Envoi à plusieurs destinataires
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            System.out.println("Email envoyé avec succès !");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Erreur lors de l'envoi de l'email : " + e.getMessage());
        }
    }

    public void sendConsultationEmail(Consultation consultation) {

        String htmlContent = "<html><body>" +
                "<h2>Bonjour " + consultation.getClient().getNom() + " " + consultation.getClient().getPrenom() + ",</h2>" +
                "<p>Votre consultation a été enregistrée avec succès !</p>" +
                "<p><strong>Détails de la consultation :</strong></p>" +
                "<ul>" +
                "<li><strong>Date de la consultation :</strong> " + consultation.getDateConsultation() + "</li>" +
                "<li><strong>Description :</strong> " + consultation.getDescription() + "</li>" +
                "<li><strong>Type d'assurance :</strong> " + consultation.getInsuranceType() + "</li>" +
                "<li><strong>Objet :</strong> " + consultation.getObjet() + "</li>" +
                "<li><strong>Statut :</strong> " + consultation.getStatut() + "</li>" +
                "<li><strong>Expert affecté :</strong> " + (consultation.getExpert() != null ? consultation.getExpert().getNom() + " " + consultation.getExpert().getPrenom() : "Pas encore d'expert") + "</li>" +
                "</ul>" +
                "<p>Nous vous contacterons bientôt avec plus de détails.</p>" +
                "<p>Merci pour votre confiance.</p>" +
                "</body></html>";


        String[] recipients = {
                consultation.getClient().getEmail(),
                "Maryemrah788@gmail.com"
        };


        sendEmail(recipients, "Confirmation de votre consultation", htmlContent);
    }

    public void sendRatingEmail(String clientEmail, Long consultationId) {
        String subject = "Demande de notation de consultation";


        String formUrl = "http://localhost:8080/submitRating/" + consultationId;


        String message = "<html>\n" +
                "<body>\n" +
                "    <h3>Merci de votre consultation</h3>\n" +
                "    <p>Nous espérons que votre consultation avec notre expert s'est bien déroulée. Veuillez donner une note et un commentaire pour la consultation.</p>\n" +
                "    <p>Veuillez cliquer sur le lien suivant pour soumettre votre évaluation :</p>\n" +
                "    <a href=\"" + formUrl + "\" style=\"color: blue; text-decoration: underline;\">Soumettre votre évaluation</a>\n" +
                "</body>\n" +
                "</html>";


        sendEmail(new String[]{clientEmail}, subject, message);
    }

    /*
    public void sendRatingEmailsForAcceptedConsultations() {
        List<Consultation> consultations = consultationService.getAcceptedConsultationsWithPassedDate();

        for (Consultation consultation : consultations) {

            emailService.sendRatingEmail(consultation.getClient().getEmail(), consultation.getId());
        }
    }*/

}
