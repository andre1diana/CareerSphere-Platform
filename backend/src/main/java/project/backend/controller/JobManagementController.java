package project.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import project.backend.service.JobManagementService;
import project.backend.dto.JobDTO;
import java.util.List;

@RestController
@RequestMapping("/api/admin/jobs")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class JobManagementController {

    @Autowired
    private JobManagementService jobManagementService;

    @GetMapping
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        return ResponseEntity.ok(jobManagementService.getAllJobs());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobManagementService.deleteJob(id);
        return ResponseEntity.ok().build();
    }
} 