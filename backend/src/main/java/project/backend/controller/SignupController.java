package project.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.backend.database.enums.Roles;
import project.backend.database.model.User;
import project.backend.database.repository.UserRepository;
import project.backend.model.SignupRequest;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/signup")
public class SignupController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public String signup(@RequestBody SignupRequest userPayload) {
        // Verifică dacă emailul este deja folosit
        if (userRepository.findByEmail(userPayload.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error: Email already in use");
        }
        System.out.println("Received signup request:");
        System.out.println("Email: " + userPayload.getEmail());
        System.out.println("Name: " + userPayload.getName());
        System.out.println("Password: " + userPayload.getPassword());
        System.out.println("Role: " + userPayload.getRole());
        // Creează utilizatorul
        User newUser = new User();
        newUser.setEmail(userPayload.getEmail());
        newUser.setName(userPayload.getName());
        newUser.setPassword(passwordEncoder.encode(userPayload.getPassword()));

        // Convertim rolul din string în enum
        try {
            newUser.setRole(Roles.valueOf(userPayload.getRole().toLowerCase()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error: Invalid role provided");
        }

        // Setăm imaginea de profil implicită
        //newUser.setProfilePicture("images/default-profile.png");

        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setIsActive(true);

        // Salvăm utilizatorul
        userRepository.save(newUser);

        return "User registered successfully!";
    }
}
