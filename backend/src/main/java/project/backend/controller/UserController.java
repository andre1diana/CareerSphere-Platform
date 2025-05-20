package project.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.backend.database.model.User;
import project.backend.service.UserService;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;

import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            User publicUser = user.get();
            publicUser.setPassword(null);
            return ResponseEntity.ok(publicUser);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Integer id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUserProfile(id, updatedUser);
            if (user != null) {
                user.setPassword(null);
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating user profile: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/email")
    public ResponseEntity<?> updateUserEmail(@PathVariable Integer id, @RequestBody Map<String, String> emailData) {
        try {
            String newEmail = emailData.get("email");
            if (newEmail == null || newEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email cannot be empty");
            }
            
            Optional<User> userOpt = userService.getUserById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            user.setEmail(newEmail);
            User updatedUser = userService.updateUserProfile(id, user);
            
            // Remove sensitive information
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating email: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> updateUserPassword(@PathVariable Integer id, @RequestBody Map<String, String> passwordData) {
        try {
            String newPassword = passwordData.get("password");
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password cannot be empty");
            }
            
            Optional<User> userOpt = userService.getUserById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            user.setPassword(newPassword);
            User updatedUser = userService.updateUserProfile(id, user);
            
            // Remove sensitive information from response
            updatedUser.setPassword(null);
            return ResponseEntity.ok().body(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating password: " + e.getMessage());
        }
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("userId") Integer userId,
            @RequestParam("profileImage") MultipartFile profileImage) {
        try {
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body("Invalid user ID");
            }

            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();

            // Process and save the profile image
            if (profileImage != null && !profileImage.isEmpty()) {
                try {
                    String fileName = userId + "_" + System.currentTimeMillis() + "_" + profileImage.getOriginalFilename();
                    java.nio.file.Path filePath = Paths.get("uploads/" + fileName);
                    Files.createDirectories(filePath.getParent()); // Ensure the directory exists
                    Files.write(filePath, profileImage.getBytes());
                    
                    String profileImageUrl = "/uploads/" + fileName;
                    user.setProfilePicture(profileImageUrl);
                    
                    // Save the user with the updated profile image
                    userService.updateUserProfile(userId, user);
                    
                    // Return the updated image URL
                    Map<String, String> response = new HashMap<>();
                    response.put("profileImageUrl", profileImageUrl);
                    
                    System.out.println("Saved profile image for user " + userId + " at: " + profileImageUrl);
                    return ResponseEntity.ok(response);
                } catch (IOException e) {
                    System.err.println("Error saving profile image: " + e.getMessage());
                    e.printStackTrace();
                    return ResponseEntity.status(500).body("Error saving profile image: " + e.getMessage());
                }
            } else {
                return ResponseEntity.badRequest().body("No image file provided");
            }
        } catch (Exception e) {
            System.err.println("Error processing profile image upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error processing profile image upload: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Integer id) {
        User updatedUser = userService.toggleUserStatus(id);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/other-users")
    public ResponseEntity<?> getOtherUsers() {
        List<User> otherUsers = userService.getOtherUsers();
        return ResponseEntity.ok(otherUsers);
    }
} 