package tn.esprit.contractmanegement.Controller;


import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.contractmanegement.Entity.Devis;
import tn.esprit.contractmanegement.Entity.DevisHabitation;
import tn.esprit.contractmanegement.Entity.DevisVoyage;
import tn.esprit.contractmanegement.Repository.DevisRepository;
import tn.esprit.contractmanegement.Service.DevisService;
import tn.esprit.contractmanegement.Dto.DevisResponseDTO;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/devis")
public class DevisController {
    @Autowired
    private DevisService devisService;

    @Autowired
    private DevisRepository devisRepository;

    @PostMapping(value = "/ajouter")
    public ResponseEntity<DevisResponseDTO> createDevis( @Valid @RequestBody Devis devis) throws MessagingException {
        DevisResponseDTO createdDevis = devisService.createDevis(devis);
        return ResponseEntity.ok(createdDevis);
    }
    @PostMapping("/ajouter-voyage")
    public ResponseEntity<DevisResponseDTO> createDevisVoyage(@Valid  @RequestBody DevisVoyage devisVoyage) throws MessagingException {
        DevisResponseDTO createdDevis = devisService.createDevis(devisVoyage);
        return ResponseEntity.ok(createdDevis);
    }
    @PostMapping("/ajouter-habitation")
    public ResponseEntity<DevisResponseDTO> createDevisHabitation(@Valid  @RequestBody DevisHabitation devisHabitation) throws MessagingException {
        DevisResponseDTO createdDevis = devisService.createDevis(devisHabitation);
        return ResponseEntity.ok(createdDevis);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Devis> getDevisById(@PathVariable Long id) {
        Optional<Devis> devis = devisService.getDevisById(id);
        if (devis.isPresent()) {
            return ResponseEntity.ok(devis.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("getAllDevis")
    public ResponseEntity<List<Devis>> getAllDevis() {
        List<Devis> devisList = devisService.getAllDevis();
        return ResponseEntity.ok(devisList);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Devis>> getUserDevis() {
        List<Devis> devisList = devisService.getDevisByUser();
        return ResponseEntity.ok(devisList);
    }

    @PutMapping("modifier/{id}")
    public ResponseEntity<DevisResponseDTO> updateDevis(@PathVariable Long id, @RequestBody DevisVoyage devis) {
        DevisResponseDTO updatedDevis = devisService.updateDevis(id, devis);
        return ResponseEntity.ok(updatedDevis);
    }
    @PutMapping("modifierHab/{id}")
    public ResponseEntity<DevisResponseDTO> updateDevisHabitation(@PathVariable Long id, @RequestBody DevisHabitation devis) {
        DevisResponseDTO updatedDevis = devisService.updateDevis(id, devis);
        return ResponseEntity.ok(updatedDevis);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DevisResponseDTO> deleteDevis(@PathVariable Long id) {
        try {
            DevisResponseDTO response = devisService.deleteDevis(id);

            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new DevisResponseDTO(id, e.getMessage()));
        }
    }
/*
    @PutMapping("/{id}/signer")
    public ResponseEntity<Devis> signerDevis(@PathVariable Long id, @RequestParam("signature") MultipartFile signatureFile) {
        try {
            byte[] signatureBytes = signatureFile.getBytes();
            return ResponseEntity.ok(devisService.signerDevis(id, signatureBytes));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
}*/

    @PostMapping("/signer/{id}")
    public ResponseEntity<?> saveSignature(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody
    ) {
        try {
            String base64Image = requestBody.get("signatureBase64");

            if (base64Image == null || base64Image.isEmpty()) {
                return ResponseEntity.badRequest().body("Signature is missing");
            }

            // Remove base64 prefix
            String cleanBase64 = base64Image.replace("data:image/png;base64,", "");
            byte[] imageBytes = Base64.getDecoder().decode(cleanBase64);

            // Save to file (optional: create folder if it doesn’t exist)
            String filename = "signature_" + id + ".png";
            Path filePath = Paths.get("uploads/signatures/", filename);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, imageBytes);

            // Optionally: save file path or base64 to DB
            Devis devis = devisRepository.findById(id).orElseThrow(() -> new RuntimeException("Devis not found"));
            devis.setSignature(filePath.toString());
            devisRepository.save(devis);

            return ResponseEntity.ok(Map.of("message", "Signature saved successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur de traitement de signature");
        }
    }





}
