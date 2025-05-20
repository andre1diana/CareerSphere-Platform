package project.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.backend.database.model.User;
import project.backend.database.enums.Roles;
import project.backend.database.model.Company;
import project.backend.database.repository.UserRepository;
import project.backend.database.repository.CompanyRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SearchController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping("/{query}")
    public ResponseEntity<?> search(@PathVariable String query) {
        try {
            List<User> users = userRepository.findByNameContainingIgnoreCase(query);
            List<User> filteredUsers = users.stream()
                .filter(user -> user.getRole() == Roles.user || user.getRole() == Roles.employer)
                .collect(Collectors.toList());

            List<Company> companies = companyRepository.findByCompanyNameContainingIgnoreCase(query);

            var response = new java.util.HashMap<String, Object>();
            response.put("users", filteredUsers);
            response.put("companies", companies);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error performing search: " + e.getMessage());
        }
    }
} 