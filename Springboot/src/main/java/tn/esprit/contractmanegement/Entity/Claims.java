package tn.esprit.contractmanegement.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import tn.esprit.contractmanegement.Enumeration.ClaimStatus;
import tn.esprit.contractmanegement.Enumeration.ReclamationType;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Claims {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idClaim;


    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le type de réclamation est obligatoire.")
    ReclamationType reclamationType;

    @Temporal(TemporalType.TIMESTAMP)
    Date reclamationDate;

    @NotBlank(message = "La description ne doit pas être vide.")
    @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères.")
    String description;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le statut est obligatoire.")
    ClaimStatus status = ClaimStatus.ENREGISTREE; // Statut par défaut

    int estimatedProcessingTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
