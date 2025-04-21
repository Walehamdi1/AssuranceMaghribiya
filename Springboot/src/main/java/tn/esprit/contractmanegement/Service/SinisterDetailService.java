package tn.esprit.contractmanegement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.SinisterDetail;
import tn.esprit.contractmanegement.Repository.SinisterDetailRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SinisterDetailService {

    @Autowired
    private SinisterDetailRepository sinisterDetailRepository;

    public List<SinisterDetail> getAllSinisterDetails() {
        return sinisterDetailRepository.findAll();
    }

    public Optional<SinisterDetail> getSinisterDetailById(Long id) {
        return sinisterDetailRepository.findById(id);
    }

    public List<SinisterDetail> getDetailsBySinisterId(Long sinisterId) {
        return sinisterDetailRepository.findBySinister_Id(sinisterId);
    }

    public SinisterDetail createSinisterDetail(SinisterDetail sinisterDetail) {
        return sinisterDetailRepository.save(sinisterDetail);
    }
    public List<SinisterDetail> getSinisterDetailsBySinisterId(Long sinisterId) {
        return sinisterDetailRepository.findBySinister_Id(sinisterId); // Corrected method call
    }

    public SinisterDetail updateSinisterDetail(Long id, SinisterDetail sinisterDetailDetails) {
        return sinisterDetailRepository.findById(id).map(detail -> {
            detail.setLocation(sinisterDetailDetails.getLocation());
            detail.setAgentID(sinisterDetailDetails.getAgentID());
            detail.setClientID(sinisterDetailDetails.getClientID());
            detail.setDescription(sinisterDetailDetails.getDescription());
            detail.setReportedDate(sinisterDetailDetails.getReportedDate());
            detail.setStatus(sinisterDetailDetails.getStatus());
            detail.setEvidenceFiles(sinisterDetailDetails.getEvidenceFiles());
            detail.setEstimatedDamageCost(sinisterDetailDetails.getEstimatedDamageCost());
            return sinisterDetailRepository.save(detail);
        }).orElse(null);
    }

    public void deleteSinisterDetail(Long id) {
        sinisterDetailRepository.deleteById(id);
    }
    public List<SinisterDetail> getMostRecentPendingSinisterDetails() {
        return sinisterDetailRepository.findMostRecentPendingSinisterDetails();
    }

    public Map<String, String> getTimeSpentInEachStatus(Long sinisterId) {
        List<Map<String, Object>> results = sinisterDetailRepository.calculateTimeSpentInEachStatus(sinisterId);
        Map<String, String> timeSpentInStatus = new HashMap<>();

        for (Map<String, Object> result : results) {
            String status = (String) result.get("status");
            long timeInSeconds = ((Number) result.get("timeSpentInSeconds")).longValue();
            timeSpentInStatus.put(status, formatDuration(timeInSeconds));
        }

        return timeSpentInStatus;
    }

    private String formatDuration(long seconds) {
        long days = seconds / (3600 * 24);
        long hours = (seconds % (3600 * 24)) / 3600;
        long minutes = (seconds % 3600) / 60;
        long secs = seconds % 60;

        if (days > 0) {
            return String.format("%dd %02dh %02dm %02ds", days, hours, minutes, secs);
        } else {
            return String.format("%02dh %02dm %02ds", hours, minutes, secs);
        }
    }
}
