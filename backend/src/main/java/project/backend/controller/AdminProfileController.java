package project.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.backend.service.AdminService;
import project.backend.dto.AdminStatisticsDTO;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminProfileController {
    
    @Autowired
    private AdminService adminService;

    @GetMapping("/statistics")
    public ResponseEntity<AdminStatisticsDTO> getAdminStatistics() {
        AdminStatisticsDTO statistics = adminService.getAdminStatistics();
        return ResponseEntity.ok(statistics);
    }
}
