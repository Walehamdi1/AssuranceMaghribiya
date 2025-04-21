package tn.esprit.contractmanegement.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.contractmanegement.Service.ConsultationScheduler;

@RestController
@RequestMapping("/api/scheduler")
public class SchedulerTestController {

    @Autowired
    private ConsultationScheduler consultationScheduler;

    @GetMapping("/test")
    public String testScheduler() {
        // Appel manuel de la méthode
        consultationScheduler.sendRatingRequests();
        return "Scheduler triggered manually!";
    }
}

