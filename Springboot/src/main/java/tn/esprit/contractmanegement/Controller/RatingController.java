/*package tn.esprit.contractmanegement.Controller;

import org.hibernate.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import tn.esprit.contractmanegement.Service.ConsultationService;
import tn.esprit.contractmanegement.Service.ExpertService;

@Controller
@RequestMapping("/submitRating")
public class RatingController {

    @Autowired
    private ConsultationService consultationService; // Service pour manipuler les consultations

    @Autowired
    private ExpertService expertService;

    @PostMapping("/{consultationId}")
    @Operation(summary = "Submit rating for a consultation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rating submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<String> submitRating(
            @PathVariable("consultationId") Long consultationId,
            @Parameter(description = "Rating for the consultation", example = "5")
            @RequestParam("rating") int rating,
            @Parameter(description = "Comment for the consultation", example = "Excellent service")
            @RequestParam("comment") String comment,
            @Parameter(description = "Rating for the expert", example = "4")
            @RequestParam("expertRating") int expertRating) {


        Optional<Consultation> optionalConsultation = consultationService.getConsultationById(consultationId);

        if (!optionalConsultation.isPresent()) {
            return ResponseEntity.badRequest().body("Consultation not found");
        }

        Consultation consultation = optionalConsultation.get();


        consultation.setRating(rating);
        consultation.setComment(comment);
        consultation.setExpertRating(expertRating);

        Expert expert = consultation.getExpert();
        if (expert != null) {
            expert.updateRating(); // Recalcule la note globale
            expertService.save(expert);
        }


        consultationService.save(consultation);

        return ResponseEntity.ok("Rating submitted for consultation ID " + consultationId);
    }

    @GetMapping("/{consultationId}")
    public String showRatingForm(@PathVariable("consultationId") Long consultationId, Model model) {

        model.addAttribute("consultationId", consultationId);

        return "rating-form";
    }
}*/
