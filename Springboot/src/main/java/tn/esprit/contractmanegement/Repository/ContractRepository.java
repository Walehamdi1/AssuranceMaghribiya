package tn.esprit.contractmanegement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.contractmanegement.Entity.Contract;
import tn.esprit.contractmanegement.Enumeration.ContractStatus;
import tn.esprit.contractmanegement.Entity.User;

import java.util.Date;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByUser(User user);
    boolean existsByContractNumber(String contractNumber);
    List<Contract> findByStatusNot(ContractStatus status);
    List<Contract> findByEndDateBetween(Date startOfDay, Date endOfDay);

}