package project.backend.database.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.backend.database.model.Application;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    @Modifying
    @Query("UPDATE Application a SET a.jobOffer = null WHERE a.jobOffer.id = :jobOfferId")
    void setJobOfferToNull(Long jobOfferId);

    @Modifying
    @Query("DELETE FROM Application a WHERE a.jobOffer.id = ?1")
    void deleteByJobOfferId(Long jobOfferId);
} 