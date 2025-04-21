package tn.esprit.contractmanegement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.*;
import tn.esprit.contractmanegement.Repository.ContractRepository;
import tn.esprit.contractmanegement.Repository.ContractVersionRepository;
import tn.esprit.contractmanegement.Repository.UserRepository;
import tn.esprit.contractmanegement.Enumeration.ContractStatus;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class ContractService implements IContractService {

    private final ContractRepository contractRepository;
    private final ContractVersionRepository versionRepository;

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    public ContractService(ContractRepository contractRepository,ContractVersionRepository versionRepository) {
        this.contractRepository = contractRepository;
        this.versionRepository = versionRepository;
    }

    @Override
    public Contract createContract(Contract contract) {
        if (contractRepository.existsByContractNumber(contract.getContractNumber())) {
            throw new RuntimeException("Contract number already exists. Please use a unique number.");
        }

        if (contract.getProperty() != null) {
            contract.getProperty().setContract(contract);
        }
        User currentUser = userService.getCurrentUser();
        contract.setUser(currentUser);
        return contractRepository.save(contract);
    }

    @Override
    public List<Contract> getAllContracts() {
        List<Contract> contracts = contractRepository.findByStatusNot(ContractStatus.ARCHIVED);
        return contracts.isEmpty() ? new ArrayList<>() : contracts;
    }

    @Override
    public Optional<Contract> getContractById(Long id) {
        return contractRepository.findById(id);
    }


    @Override
    public Contract updateContract(Long contractId, Contract updatedContract) {
        User currentUser = userService.getCurrentUser();
        updatedContract.setUser(currentUser);

        return contractRepository.findById(contractId).map(existingContract -> {

            ContractVersion version = new ContractVersion();
            version.setContractId(existingContract.getId());
            version.setContractNumber(existingContract.getContractNumber());
            version.setType(existingContract.getType());
            version.setStatus(existingContract.getStatus().name()); // if it's an enum, convert to string
            version.setPropertyAddress(existingContract.getProperty().getAddress());
            version.setPropertyValue(existingContract.getProperty().getValue());
            // ... any other fields ...
            version.setUpdatedAt(LocalDateTime.now());
            version.setUpdatedBy("admin"); // or get from SecurityContext
            Integer currentMax = versionRepository
                    .findByContractIdOrderByVersionNumberDesc(existingContract.getId())
                    .stream()
                    .map(ContractVersion::getVersionNumber)
                    .findFirst().orElse(0);
            version.setVersionNumber(currentMax + 1);

            versionRepository.save(version);

            // 3) Update the existingContract with new data
            existingContract.setContractNumber(updatedContract.getContractNumber());
            existingContract.setStartDate(updatedContract.getStartDate());
            existingContract.setEndDate(updatedContract.getEndDate());
            existingContract.setType(updatedContract.getType());
            existingContract.setStatus(updatedContract.getStatus());

            if (updatedContract.getProperty() != null) {
                existingContract.getProperty().setAddress(updatedContract.getProperty().getAddress());
                existingContract.getProperty().setValue(updatedContract.getProperty().getValue());
                // ...
            }

            return contractRepository.save(existingContract);

        }).orElseThrow(() -> new RuntimeException("Contract not found"));
    }

    @Override
    public void deleteContract(Long id) {

        if (!contractRepository.existsById(id)) {
            throw new RuntimeException("Contract not found");
        }
        contractRepository.deleteById(id);
    }

    private String computeHash(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error computing hash", e);
        }
    }

    public Contract signContract(Long contractId, byte[] signature) {
        return contractRepository.findById(contractId).map(contract -> {
            if (contract.isSigned()) {
                throw new RuntimeException("Contract is already signed.");
            }

            // Compute hash of signature
            String signatureHash = computeHash(signature);
            contract.setSignature(signature);
            contract.setSignatureHash(signatureHash);
            contract.setSigned(true);
            contract.setSignatureVerificationStatus("PENDING");
            return contractRepository.save(contract);
        }).orElseThrow(() -> new RuntimeException("Contract not found"));
    }

    public List<Contract> getContractsByUserId(Long userId) {
        User currentUser = userService.getCurrentUser();
        return contractRepository.findByUser(currentUser);
    }




    public Contract approveEsignature(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        contract.setSignatureVerificationStatus("VERIFIED");
        return contractRepository.save(contract);
    }

    public List<ContractVersion> getVersionsByContract(Long contractId) {
        return versionRepository.findByContractIdOrderByVersionNumberDesc(contractId);
    }
}

