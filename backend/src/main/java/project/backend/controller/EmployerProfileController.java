package project.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import project.backend.database.model.Company;
import project.backend.model.CompanyProfileRequest;
import project.backend.database.repository.CompanyRepository;
import project.backend.database.model.User;
import project.backend.database.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/employer")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*", exposedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class EmployerProfileController {

    private final CompanyRepository repository;
    private final UserRepository userRepository;

    public EmployerProfileController(CompanyRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @PostMapping("/profile")
    public ResponseEntity<Company> saveOrUpdateProfile(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestParam(value = "companyName", required = false) String companyName,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "createdAt", required = false) String createdAtStr,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            System.out.println("Received profile request with params: userId=" + userId + 
                              ", companyName=" + companyName +
                              ", hasDescription=" + (description != null) +
                              ", createdAt=" + createdAtStr +
                              ", hasImage=" + (profileImage != null && !profileImage.isEmpty()));
            
            // Validate userId
            if (userId == null || userId <= 0) {
                System.out.println("Invalid or missing user ID: " + userId);
                return ResponseEntity.badRequest().body(null);
            }

            // Find the user
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                System.out.println("User not found with ID: " + userId);
                return ResponseEntity.badRequest().body(null);
            }
            User user = userOpt.get();

            // Find existing company profile or create new one
            Optional<Company> existingCompany = repository.findByUserId_Id(userId);
            Company company = existingCompany.orElse(new Company());

            // Parse createdAt date if provided
            LocalDate createdAt = LocalDate.now();
            if (createdAtStr != null && !createdAtStr.isEmpty()) {
                try {
                    createdAt = LocalDate.parse(createdAtStr);
                } catch (Exception e) {
                    System.out.println("Error parsing date: " + createdAtStr + ", using current date instead");
                }
            }

            // Update company details
            if (companyName != null) {
                company.setCompanyName(companyName);
            }
            
            if (description != null) {
                company.setDescription(description);
            } else if (company.getDescription() == null) {
                company.setDescription(""); // Set default empty description if null
            }
            
            company.setCreatedAt(createdAt);
            company.setUserId(user);

            // Handle profile image upload
            if (profileImage != null && !profileImage.isEmpty()) {
                try {
                    String fileName = userId + "_" + System.currentTimeMillis() + "_" + profileImage.getOriginalFilename();
                    java.nio.file.Path filePath = Paths.get("uploads/" + fileName);
                    Files.createDirectories(filePath.getParent()); // Ensure the directory exists
                    Files.write(filePath, profileImage.getBytes());
                    String profileImageUrl = "/uploads/" + fileName;
                    user.setProfilePicture(profileImageUrl);
                    userRepository.save(user);
                    System.out.println("Saved profile image at: " + profileImageUrl);
                } catch (Exception e) {
                    System.err.println("Error saving profile image: " + e.getMessage());
                    e.printStackTrace();
                    // Continue execution even if image upload fails
                }
            }

            // Save and return the updated company
            Company savedCompany = repository.save(company);
            System.out.println("Successfully saved company profile with ID: " + savedCompany.getId());
            return ResponseEntity.ok(savedCompany);

        } catch (Exception e) {
            System.err.println("Error saving company profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/company/{userId}")
    public ResponseEntity<Company> getCompanyByUserId(@PathVariable int userId) {
        try {
            Optional<Company> company = repository.findByUserId_Id(userId);
            
            if (company.isPresent()) {
                return ResponseEntity.ok(company.get());
            } else {
                Company emptyCompany = new Company();
                Optional<User> user = userRepository.findById(userId);
                if (user.isPresent()) {
                    emptyCompany.setUserId(user.get());
                    emptyCompany.setDescription(""); // Set default empty description
                }
                return ResponseEntity.ok(emptyCompany);
            }
        } catch (Exception e) {
            System.err.println("Error fetching company profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllEmployerProfiles() {
        try {
            List<Company> companies = ((List<Company>) repository.findAll());
            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            System.err.println("Error fetching employer profiles: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
