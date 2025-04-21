package tn.esprit.contractmanegement.Service;

import tn.esprit.contractmanegement.Entity.Appointement;

import java.util.List;
import java.util.Optional;

public interface IAppointementService {


    Appointement createAppointment(Appointement appointement);
    List<Appointement> getAllAppointments();
    Optional<Appointement> getAppointmentById(Long id);
    Appointement updateAppointment(Long appointementId, Appointement updatedAppointement);
    void deleteAppointment(Long id);
}
