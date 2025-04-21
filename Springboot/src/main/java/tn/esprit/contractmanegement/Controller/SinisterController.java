package tn.esprit.contractmanegement.Controller;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.contractmanegement.Entity.Sinister;
import tn.esprit.contractmanegement.Entity.SinisterDetail;
import tn.esprit.contractmanegement.Entity.User;
import tn.esprit.contractmanegement.Enumeration.Status;
import tn.esprit.contractmanegement.Repository.SinisterRepository;
import tn.esprit.contractmanegement.Service.EmailService;
import tn.esprit.contractmanegement.Service.SinisterDetailService;
import tn.esprit.contractmanegement.Service.SinisterService;
import tn.esprit.contractmanegement.Service.UserService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/sinisters")
public class SinisterController {

    @Autowired
    private SinisterService sinisterService;

    @Autowired
    private SinisterDetailService sinisterDetailService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    private static final String UPLOAD_DIR = "uploads/";
    @Autowired
    private SinisterRepository sinisterRepository;

    @GetMapping
    public List<Sinister> getAll() {
        return sinisterService.getAllSinisters();
    }
    @GetMapping("/user")
    public ResponseEntity<List<Sinister>> getByUser() {
        User user = userService.getCurrentUser();
        List<Sinister> sinisters = sinisterRepository.findByUser(user.getUserId()); // ✅ Passe bien un Long


        return sinisters.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(sinisters);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Sinister> getById(@PathVariable Long id) {
        Optional<Sinister> sinister = sinisterService.getSinisterById(id);
        return sinister.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<List<SinisterDetail>> getSinisterDetailsBySinisterId(@PathVariable Long id) {
        List<SinisterDetail> details = sinisterDetailService.getSinisterDetailsBySinisterId(id);
        return ResponseEntity.ok(details);
    }

    @Transactional
    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<Sinister> create(
            @RequestParam("userId") Long userId,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("typeAssurance") String typeAssurance,
            @RequestParam("incidentDate") String incidentDateStr,
            @RequestParam("document") MultipartFile document) throws IOException {

        LocalDateTime localDateTime = LocalDateTime.parse(incidentDateStr, DateTimeFormatter.ISO_DATE_TIME);
        Date incidentDate = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());

        String fileName = document.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, document.getBytes());

        if (typeAssurance.equalsIgnoreCase("car")) {
            String aiPrediction = getPredictionFromAI(filePath.toFile());
            if (aiPrediction != null) {
                description += " <span style='color:red'>[AI: " + aiPrediction + "]</span>";
            }
        }

        Sinister sinister = new Sinister();
        sinister.setDescription(description);
        sinister.setLocation(location);
        sinister.setEvidenceFiles(filePath.toString());
        sinister.setTypeInsurance(typeAssurance);
        sinister.setStatus(Status.PENDING);
        sinister.setDateofcreation(new Date());
        sinister.setDateOfIncident(incidentDate);
        sinister.setUser(userId);

        // Save parent first
        Sinister createdSinister = sinisterService.createSinister(sinister);

        // Prepare and save detail separately with the parent's ID set
        SinisterDetail detail = new SinisterDetail();
        detail.setLocation(location);
        detail.setAgentID("defaultAgent");
        detail.setClientID(String.valueOf(userId));
        detail.setDescription(description);
        detail.setReportedDate(new Date());
        detail.setStatus("PENDING");
        detail.setEvidenceFiles(filePath.toString());
        detail.setEstimatedDamageCost(0.0);
        detail.setSinister(createdSinister);
        sinisterDetailService.createSinisterDetail(detail);

        return ResponseEntity.ok(createdSinister);
    }

    private String getPredictionFromAI(File imageFile) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(imageFile));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            String aiUrl = "http://localhost:5000/predict";

            ResponseEntity<Map> response = restTemplate.postForEntity(aiUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String prediction = (String) response.getBody().get("prediction");
                Double confidence = (Double) response.getBody().get("confidence");
                return prediction + " (" + String.format("%.2f", confidence * 100) + "%)";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sinister> updateSinister(
            @PathVariable Long id,
            @RequestParam("userEmail") String userEmail,
            @Valid @RequestBody Sinister sinisterDetails) throws MessagingException {

        Optional<Sinister> existingSinisterOpt = sinisterService.getSinisterById(id);

        if (existingSinisterOpt.isPresent()) {
            Sinister updatedSinister = existingSinisterOpt.get();

            // Preserve the original user from the existing sinister
            Long userId = updatedSinister.getUser();

            if (sinisterDetails.getDateOfIncident() != null) {
                updatedSinister.setDateOfIncident(sinisterDetails.getDateOfIncident());
            }
            if (sinisterDetails.getDescription() != null) {
                updatedSinister.setDescription(sinisterDetails.getDescription());
            }
            if (sinisterDetails.getStatus() != null) {
                updatedSinister.setStatus(sinisterDetails.getStatus());
            }
            if (sinisterDetails.getLocation() != null) {
                updatedSinister.setLocation(sinisterDetails.getLocation());
            }
            if (sinisterDetails.getEvidenceFiles() != null) {
                updatedSinister.setEvidenceFiles(sinisterDetails.getEvidenceFiles());
            }
            if (sinisterDetails.getTypeInsurance() != null) {
                updatedSinister.setTypeInsurance(sinisterDetails.getTypeInsurance());
            }
            if (sinisterDetails.getStatus() != null &&
                    (sinisterDetails.getStatus().equals(Status.ACCEPTED) ||
                            sinisterDetails.getStatus().equals(Status.DECLINED))) {
                updatedSinister.setProcessedDate(new Date());
            }

            // Create a new SinisterDetail log
            SinisterDetail detail = new SinisterDetail();
            detail.setSinister(updatedSinister);
            detail.setLocation(updatedSinister.getLocation());
            detail.setDescription(updatedSinister.getDescription());
            detail.setEvidenceFiles(updatedSinister.getEvidenceFiles());
            detail.setReportedDate(new Date());
            detail.setStatus(updatedSinister.getStatus() != null ? updatedSinister.getStatus().name() : "PENDING");
            detail.setClientID(String.valueOf(userId)); // ✅ Extracted from old sinister
            detail.setAgentID("agentX");
            detail.setEstimatedDamageCost(0.0);
            updatedSinister.getDetails().add(detail);

            Sinister savedSinister = sinisterService.updateSinister(id, updatedSinister);

            // Optional email notification
            if (sinisterDetails.getStatus() != null &&
                    (sinisterDetails.getStatus().equals(Status.ACCEPTED) ||
                            sinisterDetails.getStatus().equals(Status.DECLINED))) {
                if (userEmail != null) {
                    String subject = "\uD83D\uDCE2Sinister Status Update";
                    String text = "<h2>\uD83D\uDCE2 Sinister Status Update</h2>" +
                            "<p>Your sinister with the number <h3>" + savedSinister.getId() + "</h3>" +
                            " has been <h1>" + savedSinister.getStatus() + "</h1>.</p>";
                    emailService.sendEmail(userEmail, subject, text);
                }
            }

            return ResponseEntity.ok(savedSinister);
        }

        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sinisterService.deleteSinister(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pending")
    public List<Sinister> getPendingSinisters() {
        return sinisterService.getPendingSinisters();
    }

    @GetMapping("/most-recent-pending")
    public ResponseEntity<List<SinisterDetail>> getMostRecentPendingSinisterDetails() {
        List<SinisterDetail> details = sinisterDetailService.getSinisterDetailsBySinisterId(0L);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/status-count-by-date")
    public Map<String, Map<String, Long>> getStatusCountByDate() {
        return sinisterService.getStatusCountByDate();
    }

    @GetMapping("/details/files/{sinisterDetailId}")
    public ResponseEntity<Resource> serveFileBySinisterDetailId(@PathVariable Long sinisterDetailId) {
        Optional<SinisterDetail> detailOptional = sinisterDetailService.getSinisterDetailById(sinisterDetailId);

        if (!detailOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        SinisterDetail detail = detailOptional.get();
        String fullFilePath = detail.getEvidenceFiles();

        if (fullFilePath == null || fullFilePath.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Path filePath = Paths.get(fullFilePath).normalize();
        Resource resource;
        try {
            resource = new FileSystemResource(filePath);
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PutMapping("/toggle-archive/{id}")
    public ResponseEntity<Sinister> toggleArchiveSinister(@PathVariable Long id) {
        Optional<Sinister> existingSinister = sinisterRepository.findById(id);

        if (existingSinister.isPresent()) {
            Sinister sinister = existingSinister.get();
            sinister.setStatus(sinister.getStatus() == Status.ARCHIVED ? Status.PENDING : Status.ARCHIVED);
            Sinister updatedSinister = sinisterService.updateSinister(id, sinister);
            return ResponseEntity.ok(updatedSinister);
        }

        return ResponseEntity.status(404).build();
    }



    @GetMapping("/files/{sinisterId}")
    public ResponseEntity<Resource> serveFileBySinisterId(@PathVariable Long sinisterId) {
        Optional<Sinister> detailOptional = sinisterService.getSinisterById(sinisterId);

        if (!detailOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Sinister detail = detailOptional.get();
        String fullFilePath = detail.getEvidenceFiles();

        if (fullFilePath == null || fullFilePath.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Path filePath = Paths.get(fullFilePath).normalize();
        Resource resource;
        try {
            resource = new FileSystemResource(filePath);
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/estimated-time")
    public ResponseEntity<String> getEstimatedProcessingTime(@RequestParam String typeInsurance) {
        String estimatedTime = sinisterService.getEstimatedProcessingTime(typeInsurance);
        return ResponseEntity.ok(estimatedTime);
    }

    @PostMapping("/extract-text")
    public ResponseEntity<String> extractText(@RequestParam("document") MultipartFile document) {
        String extractedText = sinisterService.extractTextFromDocument(document);
        return ResponseEntity.ok(extractedText);
    }

    @PostMapping("/send-notification")
    public ResponseEntity<String> sendNotification(@RequestParam Long userId, @RequestParam String message) {
        sinisterService.sendNotification(userId, message);
        return ResponseEntity.ok("Notification sent successfully");
    }

    @GetMapping("/{sinisterId}/time-spent")
    public Map<String, String> getTimeSpentInEachStatus(@PathVariable Long sinisterId) {
        return sinisterDetailService.getTimeSpentInEachStatus(sinisterId);
    }
}
