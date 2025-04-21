package tn.esprit.contractmanegement.Service;

import jakarta.mail.MessagingException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.Contract;
import tn.esprit.contractmanegement.Repository.ContractRepository;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class RenewalNotificationService {

    private final ContractRepository contractRepository;
    private final EmailService emailService;
    private final UserService userService;

    public RenewalNotificationService(ContractRepository contractRepository,
                                      EmailService emailService,UserService userService) {

        this.contractRepository = contractRepository;
        this.emailService = emailService;
        this.userService = userService;
    }

    @Scheduled(cron = "0 0 7 * * ?")
    public void sendRenewalReminders() throws MessagingException {
        // Calculate the target date (5 days from now)
        LocalDate targetDate = LocalDate.now().plusDays(5);
        Date startOfDay = Date.from(targetDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(targetDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        // Query contracts with an endDate between startOfDay and endOfDay
        List<Contract> contractsExpiring = contractRepository.findByEndDateBetween(startOfDay, endOfDay);

        for (Contract contract : contractsExpiring) {
            // Replace this hardcoded email with the contract or user email field as appropriate.
            String clientEmail = "yessineblanco6@gmail.com";;
            String contractNumber = contract.getContractNumber();

            String subject = "Contract Renewal Reminder";
            String emailBody = "Dear Client, your contract " + contractNumber +
                    " is set to expire in 5 days. Please renew your contract soon!";

            if (clientEmail != null && !clientEmail.isEmpty()) {
                emailService.sendEmail(clientEmail, subject, emailBody);
            }
        }
    }

}
