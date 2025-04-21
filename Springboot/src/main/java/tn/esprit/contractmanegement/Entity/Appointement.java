package tn.esprit.contractmanegement.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Appointement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idAppointment;

    @NotBlank(message = "La description ne doit pas être vide.")
    @Size(max = 255, message = "La description ne doit pas dépasser 255 caractères.")
    String description;

    @Temporal(TemporalType.TIMESTAMP)
    @NotNull(message = "La date soumise est obligatoire.")
    @FutureOrPresent(message = "La date soumise ne peut pas être dans le passé.")
    Date dateSubmitted;

    @NotBlank(message = "Le statut est obligatoire.")
    @Pattern(regexp = "^(PENDING|CONFIRMED|CANCELED)$", message = "Le statut doit être 'PENDING', 'CONFIRMED' ou 'CANCELED'.")
    String status;

    @Column(name = "archiver", nullable = false)
    boolean archiver = true;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    User user;
}