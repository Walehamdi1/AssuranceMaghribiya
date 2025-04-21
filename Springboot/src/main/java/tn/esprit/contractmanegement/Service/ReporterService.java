package tn.esprit.contractmanegement.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.Appointement;
import tn.esprit.contractmanegement.Exception.InvalidReportChoiceException;
import tn.esprit.contractmanegement.Repository.AppointementRepository;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class ReporterService {

    private final AppointementRepository appointementRepository;
    private final AppointementService appointementService; // On réutilise isDateAvailable pour vérifier la disponibilité
    private static final Logger logger = Logger.getLogger(ReporterService.class.getName());

    @Autowired
    public ReporterService(AppointementRepository appointementRepository, AppointementService appointementService) {
        this.appointementRepository = appointementRepository;
        this.appointementService = appointementService;
    }

    public Optional<Appointement> reportAppointment(Long appointmentId, int daysToPostpone) {
        Optional<Appointement> optionalAppointment = appointementRepository.findById(appointmentId);
        if (optionalAppointment.isEmpty()) {
            logger.warning("Aucun rendez-vous trouvé pour l'id " + appointmentId);
            return Optional.empty();
        }

        if (daysToPostpone < 1 || daysToPostpone > 3) {
            throw new InvalidReportChoiceException("Le report doit être de 1, 2 ou 3 jours. Sinon, utilisez l'option Annuler.");
        }

        Appointement appointment = optionalAppointment.get();

        // Extraction de la date existante dans l'enregistrement
        LocalDate currentDate = appointment.getDateSubmitted()
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        // Calcul de la nouvelle date en ajoutant le nombre de jours choisi
        LocalDate newDate = currentDate.plusDays(daysToPostpone);

        // Vérification que la nouvelle date peut être utilisée (moins de 3 rendez-vous pour cette date)
        if (!appointementService.isDateAvailable(newDate)) {
            logger.info("La date " + newDate + " est saturée (3 rendez-vous déjà programmés).");
            return Optional.empty();
        }

        // Conversion de la nouvelle date vers Date et mise à jour
        Date newDateAsDate = Date.from(newDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        appointment.setDateSubmitted(newDateAsDate);
        appointementRepository.save(appointment);

        logger.info("Le rendez-vous avec l'id " + appointmentId + " a été reporté de " + daysToPostpone + " jour(s). Nouvelle date : " + newDate);
        return Optional.of(appointment);
    }

    /**
     * Annule (archive) le rendez-vous.
     *
     * @param appointmentId Identifiant du rendez-vous à annuler.
     * @return Optional contenant le rendez-vous archivé.
     */
    public Optional<Appointement> cancelAppointment(Long appointmentId) {
        Optional<Appointement> optionalAppointment = appointementRepository.findById(appointmentId);
        if (optionalAppointment.isEmpty()) {
            logger.warning("Rendez-vous non trouvé pour l'annulation. Id : " + appointmentId);
            return Optional.empty();
        }
        Appointement appointment = optionalAppointment.get();
        appointment.setArchiver(false);  // Marque le rendez-vous comme archivé
        appointementRepository.save(appointment);
        logger.info("Le rendez-vous avec l'id " + appointmentId + " a été archivé (annulé).");
        return Optional.of(appointment);
    }
}
