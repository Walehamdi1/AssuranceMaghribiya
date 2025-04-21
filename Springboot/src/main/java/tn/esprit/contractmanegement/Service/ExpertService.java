package tn.esprit.contractmanegement.Service;

import tn.esprit.contractmanegement.Entity.Expert;

import java.util.List;
import java.util.Optional;

public interface ExpertService {
    Expert saveExpert(Expert expert);

    List<Expert> getAllExperts();

    Optional<Expert> getExpertById(Long id);

    void deleteExpert(Long id);

    Expert createExpert(Expert expert);

    void save(Expert expert);

//    boolean isExpertAvailable(Long , LocalDateTime );
}
