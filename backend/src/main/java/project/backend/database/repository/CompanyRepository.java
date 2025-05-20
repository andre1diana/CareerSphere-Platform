package project.backend.database.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import project.backend.database.model.Company;

public interface CompanyRepository extends CrudRepository<Company, Integer> {
    // Custom query methods can be defined here if needed
    // For example, to find companies by name or location
    Optional<Company> findByCompanyName(String name);
    Optional<Company> findByUserId_Id(Integer userId);
    List<Company> findByCompanyNameContainingIgnoreCase(String companyName);
}
