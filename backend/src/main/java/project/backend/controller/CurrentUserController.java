package project.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import project.backend.database.model.User;
import project.backend.database.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/current-user")
public class CurrentUserController {

    private final UserRepository userRepository;

    public CurrentUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("No authentication found");
            }
            //System.out.println("Auth: " + authentication);
            //System.out.println("Principal: " + authentication.getPrincipal());


            String email;

            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                email = userDetails.getUsername();
            } else if (authentication.getPrincipal() instanceof String) {
                email = (String) authentication.getPrincipal();
            } else {
                return ResponseEntity.status(401).body("Invalid authentication principal type");
            }

            User user = userRepository.findByEmail(email)
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getId());
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("role", user.getRole());
            userData.put("profilePictureUrl", user.getProfilePicture());
            userData.put("bio", user.getBio());
            userData.put("title", user.getTitle());
            userData.put("location", user.getLocation());
            userData.put("phoneNumber", user.getPhoneNumber());
            userData.put("skills", user.getSkills());
            userData.put("experience", user.getExperience());
            userData.put("education", user.getEducation());

            //System.out.println("User data: " + userData);

            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

}
