package tn.esprit.contractmanegement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.esprit.contractmanegement.Entity.Expert;

import java.util.List;

@Repository

public interface ExpertRepository extends JpaRepository<Expert, Long> {
    @Query("SELECT e FROM Expert e ORDER BY e.rating DESC")
    List<Expert> findAllExpertsSortedByRating();
}
