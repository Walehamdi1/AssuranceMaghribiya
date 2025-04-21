package tn.esprit.contractmanegement.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.Appointement;
import tn.esprit.contractmanegement.Entity.User;
import tn.esprit.contractmanegement.Repository.AppointementRepository;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentOptimizationService {

    private final AppointementRepository appointementRepository;
    @Autowired
    private UserService userService;

    @Autowired
    public AppointmentOptimizationService(AppointementRepository appointementRepository) {
        this.appointementRepository = appointementRepository;
    }

    public Optional<Date> suggestOptimalDate(Long userId) {
        User user = userService.getCurrentUser();
        // Récupérer les rendez-vous existants pour éviter les conflits
        List<Appointement> existingAppointments = appointementRepository.findByUser(user);

        // Utiliser le calendrier pour ajouter 2 jours à la date actuelle
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 2);  // Ajoute 2 jours
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        Date suggestedDate = calendar.getTime();

        // Compter le nombre de rendez-vous existants pour cette date
        int maxAppointmentsPerDay = 3;
        int appointmentsCountForSuggestedDate = countAppointmentsForDate(existingAppointments, suggestedDate);

        // Si la date est déjà pleine, passer à la date suivante
        while (appointmentsCountForSuggestedDate >= maxAppointmentsPerDay) {
            calendar.add(Calendar.DAY_OF_YEAR, 1);  // Passe au jour suivant
            suggestedDate = calendar.getTime();
            appointmentsCountForSuggestedDate = countAppointmentsForDate(existingAppointments, suggestedDate);
        }

        return Optional.of(suggestedDate);
    }

    // Méthode pour compter combien de rendez-vous existent déjà pour une date donnée
    private int countAppointmentsForDate(List<Appointement> existingAppointments, Date date) {
        int count = 0;
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date normalizedDate = calendar.getTime();

        for (Appointement appointment : existingAppointments) {
            Date existingDate = appointment.getDateSubmitted();
            // Normaliser la date existante pour la comparaison
            calendar.setTime(existingDate);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);

            if (calendar.getTime().equals(normalizedDate)) {
                count++;
            }
        }
        return count;
    }
}
