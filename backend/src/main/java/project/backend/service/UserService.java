package project.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.backend.database.model.User;
import project.backend.database.model.UserExperience;
import project.backend.database.model.UserEducation;
import project.backend.database.repository.UserRepository;
import project.backend.database.repository.UserExperienceRepository;
import project.backend.database.repository.UserEducationRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserExperienceRepository experienceRepository;
    private final UserEducationRepository educationRepository;

    @Autowired
    public UserService(UserRepository userRepository, 
                      UserExperienceRepository experienceRepository,
                      UserEducationRepository educationRepository) {
        this.userRepository = userRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
    }

    public List<User> getAllUsers() {
        return (List<User>) userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public User updateUserProfile(Integer id, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            
            // Update basic information
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setTitle(updatedUser.getTitle());
            existingUser.setLocation(updatedUser.getLocation());
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
            existingUser.setBio(updatedUser.getBio());
            existingUser.setProfilePicture(updatedUser.getProfilePicture());
            existingUser.setSkills(updatedUser.getSkills());

            // Update experience
            if (updatedUser.getExperience() != null) {
                existingUser.setExperience(updatedUser.getExperience());
            }

            // Update education
            if (updatedUser.getEducation() != null) {
                existingUser.setEducation(updatedUser.getEducation());
            }

            return userRepository.save(existingUser);
        }
        return null;
    }

    public User toggleUserStatus(Integer id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsActive(!user.getIsActive());
            return userRepository.save(user);
        }
        return null;
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public List<User> getOtherUsers() {
        return ((List<User>) userRepository.findAll()).stream()
            .filter(user -> "user".equals(user.getRole().toString()))
            .collect(Collectors.toList());
    }
} 