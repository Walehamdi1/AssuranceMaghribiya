package tn.esprit.contractmanegement.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContractVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long contractId;
    private String contractNumber;
    private String type;
    private String status;
    private String propertyAddress;
    private double propertyValue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer versionNumber;
    private LocalDateTime updatedAt;
    private String updatedBy;
}

