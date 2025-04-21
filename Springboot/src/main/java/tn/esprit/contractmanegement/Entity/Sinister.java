package tn.esprit.contractmanegement.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.contractmanegement.Enumeration.Status;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "sinisters")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Sinister {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Date of incident is required")
    @PastOrPresent(message = "Date of incident cannot be in the future")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateOfIncident;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateofcreation;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    private Status status = Status.PENDING;

    @NotBlank(message = "Location cannot be blank")
    private String location;

    private String evidenceFiles;

    private String typeInsurance;
    private long user;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "processed_date")
    private Date processedDate;

    @OneToMany(mappedBy = "sinister", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SinisterDetail> details = new ArrayList<>();
/*
    @ManyToOne
    @JoinColumn(name = "contract_id", nullable = false)
    @JsonBackReference
    private Contract contract;
*/
}
