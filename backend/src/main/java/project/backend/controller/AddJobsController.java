package project.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import project.backend.service.JobOfferService;
import project.backend.database.model.JobOffer;
import project.backend.database.repository.CompanyRepository;
import project.backend.database.model.Company;

import java.time.LocalDateTime;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/jobs")
public class AddJobsController {

    private final JobOfferService jobOfferService;
    private final CompanyRepository companyRepository;

    public AddJobsController(JobOfferService jobOfferService, CompanyRepository companyRepository) {
        this.jobOfferService = jobOfferService;
        this.companyRepository = companyRepository;
    }

    @PostMapping
    public ResponseEntity<?> addJob(@RequestBody JobOffer jobOffer) {
        try {
            // Validate required fields
            if (jobOffer.getTitle() == null || jobOffer.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Job title is required");
            }
            if (jobOffer.getDescription() == null || jobOffer.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Job description is required");
            }
            if (jobOffer.getLocation() == null || jobOffer.getLocation().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Job location is required");
            }
            if (jobOffer.getType() == null || jobOffer.getType().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Job type is required");
            }
            if (jobOffer.getModality() == null || jobOffer.getModality().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Work modality is required");
            }

            // Validate company ID
            if (jobOffer.getCompanyId() == null || jobOffer.getCompanyId().getId() <= 0) {
                return ResponseEntity.badRequest().body("Valid company ID is required");
            }

            // Fetch and validate company
            Optional<Company> companyOpt = companyRepository.findById((int) jobOffer.getCompanyId().getId());
            if (!companyOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Company not found");
            }

            // Set the full company object
            jobOffer.setCompanyId(companyOpt.get());

            // Set creation timestamp
            jobOffer.setCreatedAt(LocalDateTime.now());

            // Save the job offer
            JobOffer savedJob = jobOfferService.save(jobOffer);
            return ResponseEntity.ok(savedJob);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error adding job: " + e.getMessage());
        }
    }
}
