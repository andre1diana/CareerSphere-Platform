package project.backend.database.repository;

import org.springframework.data.repository.CrudRepository;

import project.backend.database.model.Application;


public interface ApplicationsRepository extends CrudRepository<Application, Long> {
    // Custom query methods can be defined here if needed
    // For example, to find applications by user or job offer
    
}
