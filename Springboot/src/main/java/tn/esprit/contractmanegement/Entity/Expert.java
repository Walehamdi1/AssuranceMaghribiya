package tn.esprit.contractmanegement.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Expert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String email;
    private String nom;
    private String prenom;
    private String specialite;


    @Column(nullable = true)
    private Double rating;

    @OneToMany(mappedBy = "expert")
    @JsonIgnore // Ignorer cette relation pour éviter une boucle infinie
    private List<Consultation> consultations;

    // Méthode pour recalculer la moyenne des notes
    public void updateRating() {
        if (consultations != null && !consultations.isEmpty()) {
            double totalRating = 0;
            int count = 0;

            // Calcule la moyenne des notes des consultations de l'expert
            for (Consultation consultation : consultations) {
                if (consultation.getExpertRating() != null) {
                    totalRating += consultation.getExpertRating();
                    count++;
                }
            }


            if (count > 0) {
                this.rating = totalRating / count;
            } else {
                this.rating = null;
            }
        }
    }


//    @OneToMany(mappedBy = "expert")
    //@JsonIgnore
//    private List<Consultation> consultations;
}
