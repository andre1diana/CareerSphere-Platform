package project.backend.database.repository;

import org.springframework.data.repository.CrudRepository;

import project.backend.database.model.JobOffer;

public interface JobOfferRepository extends CrudRepository<JobOffer, Long> {
    // Custom query methods can be defined here if needed
    // For example, to find job offers by title or company name    
}
