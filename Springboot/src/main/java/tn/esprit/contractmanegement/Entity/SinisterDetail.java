package tn.esprit.contractmanegement.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "sinister_details")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SinisterDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sinister_id", nullable = false)
    @JsonBackReference
    private Sinister sinister;

    @NotBlank(message = "Location cannot be blank")
    private String location;

    @NotBlank(message = "Agent ID is required")
    private String agentID;

    @NotBlank(message = "Client ID is required")
    private String clientID;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Date of incident is required")
    @PastOrPresent(message = "Date of incident cannot be in the future")
    @Temporal(TemporalType.TIMESTAMP)
    private Date reportedDate;

    @NotBlank(message = "Status is required")
    private String status;

    private String evidenceFiles;

    @NotNull(message = "Estimated damage cost is required")
    private double estimatedDamageCost;
}
