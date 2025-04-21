package tn.esprit.contractmanegement.Service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.Sinister;
import tn.esprit.contractmanegement.Enumeration.Status;
import tn.esprit.contractmanegement.Repository.SinisterDetailRepository;
import tn.esprit.contractmanegement.Repository.SinisterRepository;

import java.time.ZoneId;
import java.util.*;

@Service
public class SinisterService {

    @Autowired
    private SinisterRepository sinisterRepository;

    @Autowired
    private SinisterDetailRepository sinisterDetailsRepository;

    public List<Sinister> getAllSinisters() {
        return sinisterRepository.findAllWithUser();
    }

    public Optional<Sinister> getSinisterById(Long id) {
        return sinisterRepository.findById(id);
    }

    public Sinister createSinister(Sinister sinister) {
        return sinisterRepository.saveAndFlush(sinister);
    }

    public Sinister updateSinister(Long id, Sinister updatedSinister) {
        Sinister existingSinister = sinisterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sinister not found"));
        System.out.println("Looking for sinister ID: " + id);


        if (updatedSinister.getDateOfIncident() != null) {
            existingSinister.setDateOfIncident(updatedSinister.getDateOfIncident());
        }
        if (updatedSinister.getDescription() != null) {
            existingSinister.setDescription(updatedSinister.getDescription());
        }
        if (updatedSinister.getStatus() != null) {
            existingSinister.setStatus(updatedSinister.getStatus());
        }
        if (updatedSinister.getLocation() != null) {
            existingSinister.setLocation(updatedSinister.getLocation());
        }
        if (updatedSinister.getEvidenceFiles() != null) {
            existingSinister.setEvidenceFiles(updatedSinister.getEvidenceFiles());
        }
        if (updatedSinister.getTypeInsurance() != null) {
            existingSinister.setTypeInsurance(updatedSinister.getTypeInsurance());
        }

        return sinisterRepository.save(existingSinister);
    }

    public List<Sinister> getPendingSinisters() {
        return sinisterRepository.findByStatus(Status.PENDING);
    }

    @Transactional
    public void deleteSinister(Long id) {
        sinisterDetailsRepository.deleteBySinister_Id(id);
        sinisterRepository.deleteById(id);
    }

    public Map<String, Map<String, Long>> getStatusCountByDate() {
        List<Sinister> sinisters = sinisterRepository.findAll();
        Map<String, Map<String, Long>> result = new TreeMap<>();

        for (Sinister sinister : sinisters) {
            String date = sinister.getDateofcreation().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().toString();
            String status = sinister.getStatus().toString();

            result.computeIfAbsent(date, k -> new HashMap<>());
            result.get(date).merge(status, 1L, Long::sum);
        }

        return result;
    }

    public String getEstimatedProcessingTime(String typeInsurance) {
        Double averageProcessingTimeInSeconds = sinisterRepository.findAverageProcessingTimeByTypeInsurance(typeInsurance);

        if (averageProcessingTimeInSeconds == null) {
            return "No data available for claims of this type.";
        }

        long averageProcessingTimeInDays = (long) (averageProcessingTimeInSeconds / (60 * 60 * 24));

        return String.format("On average, claims like yours take %d-%d business days to process.",
                averageProcessingTimeInDays, averageProcessingTimeInDays + 2);
    }

    public String extractTextFromDocument(org.springframework.web.multipart.MultipartFile document) {
        return "Extracted text from document: " + document.getOriginalFilename();
    }

    public void sendNotification(Long userId, String message) {
        System.out.println("Notification sent to user ID " + userId + ": " + message);
    }
}
