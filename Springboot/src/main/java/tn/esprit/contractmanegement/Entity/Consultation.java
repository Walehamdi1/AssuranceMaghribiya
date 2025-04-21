package tn.esprit.contractmanegement.Entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Task name cannot be empty")
    @Size(min = 5, max = 100, message = "L'objet de la consultation doit avoir entre 5 et 100 caractères")
    private String objet;

    @NotBlank(message = "La description de la consultation ne peut pas être nulle")
    @Size(min = 10, max = 500, message = "La description de la consultation doit avoir entre 10 et 500 caractères")
    private String description;

    @NotNull(message = "La date de consultation ne peut pas être nulle")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")


    private LocalDateTime dateConsultation;
    @JoinColumn(name = "client_id")
//    @JsonBackReference

//    @Enumerated(EnumType.STRING)
    @JsonProperty("statut")
    @Column(nullable = false)
    private String statut;


    @Column(name = "insurance_type", nullable = false)
    private String insuranceType;
    @Column(nullable = true)
    private Integer rating; // La note (1 à 5)

    @Column(length = 500, nullable = true)
    private String comment;

    @Column(nullable = true)
    private Integer expertRating;

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    @ManyToOne
    private Client client;

    @ManyToOne
    private Expert expert;


}