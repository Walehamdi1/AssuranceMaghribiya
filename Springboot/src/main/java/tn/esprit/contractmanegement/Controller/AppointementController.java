package tn.esprit.contractmanegement.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.contractmanegement.Entity.Appointement;
import tn.esprit.contractmanegement.Exception.InvalidReportChoiceException;
import tn.esprit.contractmanegement.Service.AppointementService;

import jakarta.validation.Valid;
import tn.esprit.contractmanegement.Service.AppointmentOptimizationService;
import tn.esprit.contractmanegement.Service.ReporterService;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointementController {

    private final AppointementService appointementService;
    private final AppointmentOptimizationService optimizationService;
    private final ReporterService reporterService;

    public AppointementController(AppointementService appointementService, AppointmentOptimizationService optimizationService, ReporterService reporterService) {
        this.appointementService = appointementService;
        this.optimizationService = optimizationService;
        this.reporterService = reporterService;
    }
    @GetMapping("/archived")
    public ResponseEntity<List<Appointement>> getArchivedAppointments() {
        List<Appointement> archivedAppointments = appointementService.getArchivedAppointments();
        return archivedAppointments.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(archivedAppointments);
    }


    // ✅ Create an appointment
    @PostMapping
    public ResponseEntity<Appointement> createAppointment(@Valid @RequestBody Appointement appointement) {
        try {
            Appointement createdAppointement = appointementService.createAppointment(appointement);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Get all appointments
    @GetMapping
    public ResponseEntity<List<Appointement>> getAllAppointments() {
        List<Appointement> appointments = appointementService.getAllAppointments();
        return appointments.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(appointments);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Appointement>> getAppointmentsByUser() {
        List<Appointement> appointments = appointementService.getAppointmentsByUser();
        return appointments.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(appointments);
    }

    // ✅ Get appointment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointement> getAppointmentById(@PathVariable Long id) {
        Optional<Appointement> appointementOptional = appointementService.getAppointmentById(id);
        return appointementOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // ✅ Update appointment
    @PutMapping("/{appointementId}")
    public ResponseEntity<Appointement> updateAppointment(@PathVariable Long appointementId, @Valid @RequestBody Appointement updatedAppointement) {
        Optional<Appointement> existingAppointement = appointementService.getAppointmentById(appointementId);
        if (existingAppointement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Appointement appointement = appointementService.updateAppointment(appointementId, updatedAppointement);
        return ResponseEntity.ok(appointement);
    }

    // ✅ Delete appointment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        if (appointementService.getAppointmentById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        appointementService.deleteAppointment(id);
        return ResponseEntity.noContent().build(); // ✅ Ensures correct return type
    }

    @GetMapping("/suggest/{userId}")
    public ResponseEntity<String> suggestOptimalDate(@PathVariable Long userId) {
        Optional<Date> suggestedDate = optimizationService.suggestOptimalDate(userId);
        return suggestedDate.map(date -> ResponseEntity.ok(new SimpleDateFormat("yyyy-MM-dd").format(date)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NO_CONTENT).build());
    }
    @GetMapping("/check-availability/{date}")
    public ResponseEntity<Boolean> checkDateAvailability(@PathVariable String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        boolean isAvailable = appointementService.isDateAvailable(appointmentDate);
        return ResponseEntity.ok(isAvailable);
    }

    @PutMapping("/{id}/report")
    public ResponseEntity<?> reportAppointment(@PathVariable Long id, @RequestParam int days) {
        try {
            Optional<Appointement> updatedAppointment = reporterService.reportAppointment(id, days);
            if (updatedAppointment.isPresent()) {
                return ResponseEntity.ok(updatedAppointment.get());
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("La date calculée est saturée (3 rendez-vous déjà programmés) ou le rendez-vous n'existe pas.");
            }
        } catch (InvalidReportChoiceException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
