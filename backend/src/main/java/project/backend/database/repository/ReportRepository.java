package project.backend.database.repository;

import org.springframework.data.repository.CrudRepository;

import project.backend.database.model.Report;

public interface ReportRepository extends CrudRepository<Report, Integer> {

    long countByStatus(String string);
    // Custom query methods can be defined here if needed
    
}
