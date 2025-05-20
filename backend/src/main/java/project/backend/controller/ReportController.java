package project.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.backend.database.model.Report;
import project.backend.database.model.User;
import project.backend.database.model.Notification;
import project.backend.database.enums.ReportType;
import project.backend.database.enums.Roles;
import project.backend.database.repository.ReportRepository;
import project.backend.database.repository.UserRepository;
import project.backend.database.repository.NotificationRepository;
import project.backend.service.UserService;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createReport(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("Received report request: " + request);

            Integer reporterId = (Integer) request.get("reporterId");
            Integer reportedId = (Integer) request.get("reportedId");
            String reportType = (String) request.get("reportType");
            String description = (String) request.get("description");

            if (reporterId == null || reportedId == null || reportType == null) {
                System.out.println("Missing required fields. ReporterId: " + reporterId + 
                    ", ReportedId: " + reportedId + ", ReportType: " + reportType);
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            User reporter = userService.getUserById(reporterId).orElse(null);
            User reported = userService.getUserById(reportedId).orElse(null);

            if (reporter == null || reported == null) {
                System.out.println("User not found. Reporter: " + reporter + ", Reported: " + reported);
                return ResponseEntity.notFound().build();
            }

            try {
                ReportType.valueOf(reportType.toUpperCase());
            } catch (IllegalArgumentException e) {
                System.out.println("Invalid report type: " + reportType);
                return ResponseEntity.badRequest().body("Invalid report type");
            }

            Report report = new Report(
                reporter,
                reported,
                ReportType.valueOf(reportType.toUpperCase()),
                description,
                "Pending"
            );
            Report savedReport = reportRepository.save(report);
            System.out.println("Report saved successfully: " + savedReport.getId());

            // Create notification for admin
            User admin = userRepository.findByRole(Roles.admin).stream().findFirst().orElse(null);
            if (admin != null) {
                Notification notification = new Notification(
                    admin,
                    String.format("New report received: %s reported %s for %s", 
                        reporter.getName(), 
                        reported.getName(), 
                        reportType),
                    LocalDateTime.now(),
                    false
                );
                notificationRepository.save(notification);
                System.out.println("Notification created for admin");
            }

            return ResponseEntity.ok(savedReport);
        } catch (Exception e) {
            System.err.println("Error creating report: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating report: " + e.getMessage());
        }
    }
} 