package project.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.backend.service.EmailService;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendContactEmail(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("nume");
            String email = request.get("email");
            String message = request.get("mesaj");

            if (name == null || email == null || message == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            emailService.sendContactEmail(name, email, message);
            return ResponseEntity.ok().body("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending email: " + e.getMessage());
        }
    }
} 