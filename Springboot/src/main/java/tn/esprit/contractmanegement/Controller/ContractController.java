package tn.esprit.contractmanegement.Controller;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.contractmanegement.Entity.Contract;
import tn.esprit.contractmanegement.Entity.ContractVersion;
import tn.esprit.contractmanegement.Entity.User;
import tn.esprit.contractmanegement.Repository.ContractRepository;
import tn.esprit.contractmanegement.Service.ContractService;

import jakarta.validation.Valid;
import tn.esprit.contractmanegement.Service.EmailService;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ContractRepository contractRepository;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping
    public ResponseEntity<Contract> createContract(@Valid @RequestBody Contract contract) {
        try {
            Contract createdContract = contractService.createContract(contract);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdContract);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/user")
    public List<Contract> getAllContracts(@AuthenticationPrincipal User user) {
        return contractService.getContractsByUserId(user.getUserId());
    }

    @GetMapping
    public ResponseEntity<List<Contract>> getAllContracts() {
        List<Contract> contracts = contractService.getAllContracts();
        return contracts.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(contracts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contract> getContractById(@PathVariable Long id) {
        Optional<Contract> contractOptional = contractService.getContractById(id);
        return contractOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{contractId}")
    public ResponseEntity<Contract> updateContract(@PathVariable Long contractId, @Valid @RequestBody Contract updatedContract) {
        Optional<Contract> existingContract = contractService.getContractById(contractId);
        if (existingContract.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Contract contract = contractService.updateContract(contractId, updatedContract);
        return ResponseEntity.ok(contract);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable Long id) {
        if (contractService.getContractById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        contractService.deleteContract(id);
        return ResponseEntity.noContent().build(); // ✅ Ensures correct return type
    }

    @PutMapping("/{id}/signer")
    public ResponseEntity<Contract> signerContract(@PathVariable Long id,
                                                   @RequestParam("signature") MultipartFile signatureFile) {
        try {
            byte[] signatureBytes = signatureFile.getBytes();
            Contract signedContract = contractService.signContract(id, signatureBytes);
            return ResponseEntity.ok(signedContract);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/user/{userId}")
    public List<Contract> getContractsByUserId(@PathVariable Long userId) {
        return contractService.getContractsByUserId(userId);
    }

    @PutMapping("/{id}/verify-signature")
    public ResponseEntity<Contract> verifySignature(@PathVariable Long id, @RequestParam("status") String status) {
        Contract contract = contractService.getContractById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        contract.setSignatureVerificationStatus(status.toUpperCase());
        return ResponseEntity.ok(contractService.updateContract(id, contract));
    }
    @PutMapping("/{id}/approve-esign")
    public ResponseEntity<Contract> approveEsign(@PathVariable Long id) {
        try {
            Contract updated = contractService.approveEsignature(id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{contractId}/versions")
    public ResponseEntity<List<ContractVersion>> getVersions(@PathVariable Long contractId) {
        List<ContractVersion> versions = contractService.getVersionsByContract(contractId);
        return ResponseEntity.ok(versions);
    }
    @GetMapping("/test/send-renewal-reminders")
    public ResponseEntity<String> testSendRenewalReminders() throws MessagingException {
        LocalDate targetDate = LocalDate.now().plusDays(5);
        Date startOfDay = Date.from(targetDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(targetDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        List<Contract> contractsExpiring = contractRepository.findByEndDateBetween(startOfDay, endOfDay);

        for (Contract contract : contractsExpiring) {
            // Replace this hardcoded email with the contract or user email field as appropriate.
            String clientEmail = "yessineblanco6@gmail.com";
            String contractNumber = contract.getContractNumber();

            String subject = "Contract Renewal Reminder";
            String emailBody = "Dear Client, your contract " + contractNumber +
                    " is set to expire in 5 days. Please renew your contract soon!";

            if (clientEmail != null && !clientEmail.isEmpty()) {
                emailService.sendEmail(clientEmail, subject, emailBody);
            }
        }
        return ResponseEntity.ok("Renewal reminders test executed successfully.");
    }
}

