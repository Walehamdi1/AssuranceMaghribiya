package tn.esprit.contractmanegement.Service;


import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.*;
import tn.esprit.contractmanegement.Repository.DevisRepository;
import tn.esprit.contractmanegement.Repository.PaiementRepository;
import tn.esprit.contractmanegement.Repository.UserRepository;
import tn.esprit.contractmanegement.Dto.DevisResponseDTO;
import tn.esprit.contractmanegement.Enumeration.StatutDevis;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DevisServiceImpl  implements  DevisService {
    @Autowired
    private DevisRepository devisRepository;
    @Autowired
    private EmailService emailService;

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private RiskScoringService riskScoringService;

    @Autowired
    private PricingAdjustmentService pricingAdjustmentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // Créer un devis
    @Override
    public DevisResponseDTO createDevis(Devis devis) throws MessagingException {

        User currentUser = userService.getCurrentUser();
        devis.setUser(currentUser);

        // Étape 1: Calcul initial selon le type
        BigDecimal montantInitial = calculerMontantInitial(devis);
        devis.setMontantTotal(montantInitial);
        System.out.println("Montant initial : " + montantInitial);

        // Étape 2: Calcul du score de risque
        BigDecimal riskScore = riskScoringService.calculateRiskScore(devis);
        devis.getUser().setRiskScore(riskScore);
        userRepository.save(devis.getUser());
        System.out.println("Score de risque calculé : " + riskScore);

        // Étape 3: Ajustement du montant en fonction du risque
        BigDecimal montantAjuste = pricingAdjustmentService.adjustPremium(devis);
        devis.setMontantTotal(montantAjuste);
        System.out.println("Montant après ajustement : " + montantAjuste);

        Devis savedDevis = devisRepository.save(devis);

        String subject = "New Devis " + savedDevis.getId() + " Created";
        String text = generateHtmlEmail(devis);
        emailService.sendEmail(savedDevis.getEmailClient(), subject, text);

        return new DevisResponseDTO(savedDevis.getId(),
                "Devis with ID " + savedDevis.getId() + " has been added and email sent.");
    }

    private BigDecimal calculerMontantInitial(Devis devis) {
        if (devis instanceof DevisVoyage devisVoyage) {
            BigDecimal montant = calculerMontantVoyage(devisVoyage);
            devis.setMontantTotal(montant); // 👈 important to set before premium adjustment
            return montant;
        }

        if (devis instanceof DevisHabitation devisHabitation) {
            if (devisHabitation.getMontantTotal() == null) {
                throw new IllegalArgumentException("Le montant doit être envoyé pour un devis habitation.");
            }
            return calculerMontantHabitation(devisHabitation);
        }

        throw new IllegalArgumentException("Type de devis non pris en charge.");
    }


    private BigDecimal calculerMontantHabitation(DevisHabitation habitation) {
        BigDecimal montant = habitation.getMontantTotal();
        BigDecimal surface = BigDecimal.valueOf(habitation.getSurface());

        BigDecimal tauxBase = new BigDecimal("0.0015");
        BigDecimal surfaceMultiplier = BigDecimal.ONE;

        if (montant.compareTo(new BigDecimal("200000")) > 0) {
            tauxBase = new BigDecimal("0.0025");
        } else if (montant.compareTo(new BigDecimal("100000")) > 0) {
            tauxBase = new BigDecimal("0.0020");
        }

        if (surface.compareTo(new BigDecimal("200")) > 0) {
            surfaceMultiplier = new BigDecimal("1.5");
        } else if (surface.compareTo(new BigDecimal("100")) > 0) {
            surfaceMultiplier = new BigDecimal("1.2");
        }

        BigDecimal prime = montant.multiply(tauxBase).multiply(surfaceMultiplier);
        System.out.println("Montant calculé pour habitation : " + prime);
        return prime.setScale(2, BigDecimal.ROUND_HALF_UP);
    }


    private BigDecimal calculerMontantVoyage(DevisVoyage devisVoyage) {
        BigDecimal montantBase;

        if ("Tunisian".equalsIgnoreCase(devisVoyage.getNationalite())) {
            montantBase = new BigDecimal("500");
        } else {
            montantBase = new BigDecimal("600");
        }

        System.out.println("Montant basé sur nationalité : " + montantBase);

        int age = Integer.parseInt(devisVoyage.getTrancheAge());
        if (age < 18) {
            montantBase = montantBase.subtract(new BigDecimal("100"));
            System.out.println("Réduction appliquée pour enfant (-100)");
        } else if (age >= 18) {
            montantBase = montantBase.add(new BigDecimal("200"));
            System.out.println("Majoration appliquée pour adulte (+200)");
        }

        if ("europe".equalsIgnoreCase(devisVoyage.getDestination())) {
            montantBase = montantBase.multiply(new BigDecimal("1.3"));
            System.out.println("Majoration appliquée pour destination Europe (x1.3)");
        }

        System.out.println("Montant final calculé pour voyage : " + montantBase);
        return montantBase.setScale(2, BigDecimal.ROUND_HALF_UP);
    }



    private String generateHtmlEmail(Devis devis) {
        return "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }" +
                "table { width: 100%; max-width: 600px; margin: auto; padding: 20px; border-collapse: collapse; background-color: #ffffff; }" +
                "td { padding: 10px; border: 1px solid #ddd; text-align: left; }" +
                "th { background-color: #4CAF50; color: white; text-align: left; padding: 10px; }" +
                "h1 { color: #333; }" +
                "p { color: #555; font-size: 16px; }" +
                "a { color: #ffffff; text-decoration: none; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px; display: inline-block; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<table>" +
                "<tr><th colspan='2'><h1>Your Devis Details</h1></th></tr>" +
                "<tr><td colspan='2'><p>Dear " + devis.getNomClient() + ",</p>" +
                "<p>Thank you for choosing our service! Below are the details of your recently created Devis:</p></td></tr>" +
                "<tr><td><strong>Type of Assurance:</strong></td><td>" + devis.getTypeAssurance() + "</td></tr>" +
                "<tr><td><strong>Status:</strong></td><td>" + devis.getStatut() + "</td></tr>" +  // Displaying StatutDevis
                "<tr><td><strong>Start Date:</strong></td><td>" + devis.getDateDebut() + "</td></tr>" +
                "<tr><td><strong>End Date:</strong></td><td>" + devis.getDateFin() + "</td></tr>" +
                "</table>" +
                "<p style='text-align: center;'>Click the button below to view more details:</p>" +
                "<p style='text-align: center;'><a href='http://yourwebsite.com'>View Your Devis</a></p>" +
                "<p style='text-align: center;'>If you have any questions, feel free to contact us.</p>" +
                "</body>" +
                "</html>";
    }

    @Override
    public Optional<Devis> getDevisById(Long id) {
        return  devisRepository.findById(id);
    }

    @Override
    public List<Devis> getAllDevis() {
        List<Devis> devisList = devisRepository.findAll();
        return devisList;
    }

    @Override
    @Transactional
    public DevisResponseDTO updateDevis(Long id, Devis incomingDevis) {
        Optional<Devis> optional = devisRepository.findById(id);

        if (optional.isEmpty()) {
            return new DevisResponseDTO(id, "Devis with ID " + id + " not found.");
        }

        Devis existing = optional.get();

        // Update shared fields
        existing.setNomClient(incomingDevis.getNomClient());
        existing.setEmailClient(incomingDevis.getEmailClient());
        existing.setTypeAssurance(incomingDevis.getTypeAssurance());
        existing.setDateDebut(incomingDevis.getDateDebut());
        existing.setDateFin(incomingDevis.getDateFin());
        existing.setMontantTotal(incomingDevis.getMontantTotal());
        existing.setStatut(incomingDevis.getStatut());
        existing.setSigne(incomingDevis.isSigne());
        existing.setSignature(incomingDevis.getSignature());

        // Update subclass-specific fields
        if (existing instanceof DevisVoyage existingVoyage && incomingDevis instanceof DevisVoyage incomingVoyage) {
            existingVoyage.setDestination(incomingVoyage.getDestination());
            existingVoyage.setTrancheAge(incomingVoyage.getTrancheAge());
            existingVoyage.setNationalite(incomingVoyage.getNationalite());
        } else if (existing instanceof DevisHabitation existingHab && incomingDevis instanceof DevisHabitation incomingHab) {
            existingHab.setAdresse(incomingHab.getAdresse());
            existingHab.setSurface(incomingHab.getSurface());
        }

        devisRepository.save(existing);
        return new DevisResponseDTO(existing.getId(), "Devis with ID " + existing.getId() + " updated successfully.");
    }


    @Override
    public DevisResponseDTO deleteDevis(Long id) {
        Optional<Devis> devisToDeleteOptional = devisRepository.findById(id);
        if (devisToDeleteOptional.isPresent()) {
            Devis devisToDelete = devisToDeleteOptional.get();
            for (Paiement paiement : devisToDelete.getPaiements()) {
                paiementRepository.delete(paiement);  // Ensure paiement is deleted
            }
            devisRepository.delete(devisToDelete);
            return new DevisResponseDTO(id, "Devis with ID " + id + " has been deleted successfully.");
        } else {
            return new DevisResponseDTO(id, "Devis with ID " + id + " not found.");
        }
    }


    public Devis signerDevis(Long devisId, String signature) {
        Devis devis = devisRepository.findById(devisId)
                .orElseThrow(() -> new RuntimeException("Devis non trouvé"));

        if (devis.isSigne()) {
            throw new RuntimeException("Le devis est déjà signé et ne peut plus être modifié.");
        }
        devis.setSignature(signature);
        devis.setSigne(true);
        return devisRepository.save(devis);
    }



    public void calculerPrimeDevisVoyage(DevisVoyage devisVoyage) {
        BigDecimal primeBase = new BigDecimal(100); // Exemple de prime de base

        if (devisVoyage.getTrancheAge().equals("18-30")) {
            primeBase = primeBase.multiply(new BigDecimal(1.2));
        }

        if (devisVoyage.getDestination().equals("europe")) {
            primeBase = primeBase.multiply(new BigDecimal(1.3));
        }

        devisVoyage.setMontantTotal(primeBase);
    }

    @Override
    public List<Devis> getDevisByUser() {
        User currentUser = userService.getCurrentUser();
        return devisRepository.findByUser(currentUser);
    }


    @Scheduled(cron = "0 0 12 * * ?")
    public void checkDevisExpiry() throws MessagingException {
        LocalDate now = LocalDate.now();
        List<Devis> allDevis = devisRepository.findAll();

        for (Devis devis : allDevis) {
            if (devis.getDateFin() != null && devis.getDateFin().isBefore(now.plusDays(3)) && devis.getDateFin().isAfter(now)) {
                System.out.println("this is the expired devis " +devis);
                emailService.sendEmail(devis.getEmailClient(), "Reminder: Your insurance is about to expire", "Your insurance with ID " + devis.getId() + " is expiring soon on " + devis.getDateFin());
            }
        }
    }
    @Scheduled(cron = "0 0 12 * * ?")
    @Transactional
    public void processExpiringDevis() throws MessagingException {
        LocalDate today = LocalDate.now();
        List<Devis> allDevis = devisRepository.findAll();

        for (Devis devis : allDevis) {
            if (devis.getDateFin() != null && devis.getDateFin().isEqual(today) && devis.getStatut() != StatutDevis.EXPIRE) {
                devis.setStatut(StatutDevis.EXPIRE);
                devisRepository.save(devis);
                System.out.println("devis " +devis + "changed status to EXPIRE");
                emailService.sendEmail(devis.getEmailClient(), "Your Insurance Has Expired", "Your insurance with ID " + devis.getId() + " has expired today. Please contact us for renewal.");
            }
        }
    }
}
