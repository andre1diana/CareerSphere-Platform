package project.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import project.backend.database.repository.UserRepository;
import project.backend.model.UserProfileResponse;
import project.backend.database.model.User;

@RestController
@RequestMapping("/profile")
public class UserProfileController {
    private final UserRepository userRepository;
    
    public UserProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/current")
    public String getUserProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        UserProfileResponse response = new UserProfileResponse();
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().toString());
        //response.setDepartment("Administration");
        response.setJoinDate(user.getCreatedAt().toString());
        response.setProfileImage(user.getProfilePicture());

        return response.toString();
    }
}
