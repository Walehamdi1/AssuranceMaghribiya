package tn.esprit.contractmanegement.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.contractmanegement.Entity.Expert;
import tn.esprit.contractmanegement.Repository.ExpertRepository;
import tn.esprit.contractmanegement.Service.ExpertService;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/experts")
public class ExpertController {

    private final ExpertService expertService;


    @Autowired
    public ExpertController(ExpertService expertService) {
        this.expertService = expertService;
    }

    @Autowired
    private ExpertRepository expertRepository;

    @PostMapping
    public ResponseEntity<Expert> createExpert(@RequestBody Expert expert) {
        Expert createdExpert = expertService.createExpert(expert);
        return new ResponseEntity<>(createdExpert, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Expert>> getAllExperts() {
        List<Expert> experts = expertService.getAllExperts();
        return new ResponseEntity<>(experts, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expert> getExpertById(@PathVariable Long id) {
        Optional<Expert> expert = expertService.getExpertById(id);
        return expert.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpert(@PathVariable Long id) {
        Optional<Expert> expert = expertService.getExpertById(id);
        if (expert.isPresent()) {
            expertService.deleteExpert(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Expert> updateExpert(@PathVariable Long id, @RequestBody Expert expertDetails) {
        Optional<Expert> optionalExpert = expertRepository.findById(id);

        if (optionalExpert.isPresent()) {
            Expert expert = optionalExpert.get();
            expert.setNom(expertDetails.getNom());
            expert.setPrenom(expertDetails.getPrenom());
            expert.setEmail(expertDetails.getEmail());
            expert.setSpecialite(expertDetails.getSpecialite());

            Expert updatedExpert = expertRepository.save(expert);
            return ResponseEntity.ok(updatedExpert);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    @PostMapping("/assignConsultation")
//    public ResponseEntity<String> assignConsultation(@RequestParam Long expertId, @RequestParam LocalDateTime consultationDate) {
//        boolean isAvailable = expertService.isExpertAvailable(expertId, consultationDateTime);
//
//        if (!isAvailable) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Expert is not available at this date.");
//        }
//
//        // Code pour affecter la consultation à l'expert
//        return ResponseEntity.ok("Consultation successfully assigned.");
//    }
}
