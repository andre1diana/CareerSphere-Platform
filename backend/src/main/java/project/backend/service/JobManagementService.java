package project.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.backend.dto.JobDTO;
import project.backend.database.repository.JobOfferRepository;
import project.backend.database.repository.ApplicationRepository;
import project.backend.database.model.JobOffer;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobManagementService {

    @Autowired
    private JobOfferRepository jobOfferRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<JobDTO> getAllJobs() {
        return ((List<JobOffer>) jobOfferRepository.findAll()).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteJob(Long id) {
        // First delete all applications associated with this job offer
        applicationRepository.deleteByJobOfferId(id);
        // Then delete the job offer
        jobOfferRepository.deleteById(id);
    }

    private JobDTO convertToDTO(JobOffer job) {
        JobDTO dto = new JobDTO();
        dto.setId((long)job.getId());
        dto.setTitle(job.getTitle());
        //dto.setActive(job.isActive());
        dto.setDescription(job.getDescription());
        dto.setCompany(job.getCompanyId().getCompanyName());
        dto.setLocation(job.getLocation());
        dto.setSalary(job.getSalary());
        return dto;
    }
} 