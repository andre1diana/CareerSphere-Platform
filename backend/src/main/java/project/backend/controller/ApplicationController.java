package project.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.backend.database.model.Application;
import project.backend.database.model.Company;
import project.backend.database.model.JobOffer;
import project.backend.database.model.User;
import project.backend.database.model.Notification;
import project.backend.database.enums.ApplicationStatus;
import project.backend.database.repository.ApplicationsRepository;
import project.backend.database.repository.CompanyRepository;
import project.backend.database.repository.UserRepository;
import project.backend.database.repository.NotificationRepository;
import project.backend.service.UserService;
import project.backend.service.JobOfferService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired
    private ApplicationsRepository applicationsRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobOfferService jobOfferService;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserApplications(@PathVariable Integer userId) {
        User user = userService.getUserById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<Application> applications = StreamSupport.stream(applicationsRepository.findAll().spliterator(), false)
            .filter(app -> app.getUser().getId().equals(userId))
            .collect(Collectors.toList());

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<?> getEmployerApplications(@PathVariable Integer employerId) {
        User employer = userService.getUserById(employerId).orElse(null);
        if (employer == null || !employer.getRole().toString().equals("employer")) {
            return ResponseEntity.notFound().build();
        }

        // Find the company associated with this employer
        Optional<Company> companyOpt = companyRepository.findByUserId_Id(employerId);
        if (!companyOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Application> applications = StreamSupport.stream(applicationsRepository.findAll().spliterator(), false)
            .filter(app -> app.getJobOffer().getCompanyId().getId() == companyOpt.get().getId())
            .collect(Collectors.toList());

        return ResponseEntity.ok(applications);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createApplication(@RequestBody Map<String, Integer> request) {
        try {
            Integer userId = request.get("userId");
            Integer jobOfferId = request.get("jobOfferId");

            if (userId == null || jobOfferId == null) {
                return ResponseEntity.badRequest().body("User ID and Job Offer ID are required");
            }

            User user = userService.getUserById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            JobOffer jobOffer = jobOfferService.getJobOfferById(jobOfferId.longValue()).orElse(null);
            if (jobOffer == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if application already exists
            boolean applicationExists = StreamSupport.stream(applicationsRepository.findAll().spliterator(), false)
                .anyMatch(app -> app.getUser().getId().equals(userId) && 
                               app.getJobOffer().getId() == jobOfferId);

            if (applicationExists) {
                return ResponseEntity.badRequest().body("You have already applied for this job");
            }

            Application application = new Application(user, jobOffer, ApplicationStatus.pending);
            Application savedApplication = applicationsRepository.save(application);
            return ResponseEntity.ok(savedApplication);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating application: " + e.getMessage());
        }
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Integer applicationId,
            @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            if (newStatus == null) {
                return ResponseEntity.badRequest().body("Status is required");
            }

            Application application = applicationsRepository.findById(applicationId.longValue()).orElse(null);
            if (application == null) {
                return ResponseEntity.notFound().build();
            }

            // Update application status
            application.setStatus(ApplicationStatus.valueOf(newStatus.toLowerCase()));
            Application updatedApplication = applicationsRepository.save(application);

            // Create notification for the applicant
            String notificationContent = String.format(
                "Your application for %s has been %s",
                application.getJobOffer().getTitle(),
                newStatus.toLowerCase()
            );

            Notification notification = new Notification(
                application.getUser(),
                notificationContent,
                LocalDateTime.now(),
                false
            );
            notificationRepository.save(notification);

            return ResponseEntity.ok(updatedApplication);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating application status: " + e.getMessage());
        }
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<?> getUserNotifications(@PathVariable Integer userId) {
        try {
            List<Notification> notifications = notificationRepository.findByUserId_IdOrderByCreatedAtDesc(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching notifications: " + e.getMessage());
        }
    }
} 