package tn.esprit.contractmanegement.Service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.Expert;
import tn.esprit.contractmanegement.Repository.ConsultationRepository;
import tn.esprit.contractmanegement.Repository.ExpertRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ExpertServiceImp implements ExpertService {

    @Autowired
    private ExpertRepository expertRepository;
    @Autowired
    private ConsultationRepository consultationRepository;

    @Override
    @Transactional
    public Expert saveExpert(Expert expert) {
        return expertRepository.save(expert);
    }

    @Override
    public List<Expert> getAllExperts() {
        return expertRepository.findAll();
    }

    @Override
    public Optional<Expert> getExpertById(Long id) {
        return expertRepository.findById(id);
    }

    @Override
    @Transactional
    public void deleteExpert(Long id) {
        expertRepository.deleteById(id);
    }

    @Override

    public Expert createExpert(Expert expert) {
        return expertRepository.save(expert);
    }

    @Override
    public void save(Expert expert) {

    }

}


