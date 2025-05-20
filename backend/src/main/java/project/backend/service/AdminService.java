package project.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.backend.dto.AdminStatisticsDTO;
import project.backend.database.repository.UserRepository;
import project.backend.database.repository.CompanyRepository;
import project.backend.database.repository.JobOfferRepository;
import project.backend.database.repository.ReportRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobOfferRepository jobOfferRepository;

    @Autowired
    private ReportRepository reportRepository;

    public AdminStatisticsDTO getAdminStatistics() {
        AdminStatisticsDTO statistics = new AdminStatisticsDTO();
        
        statistics.setTotalUsers(userRepository.count());
        statistics.setTotalCompanies(companyRepository.count());
        statistics.setTotalJobPostings(jobOfferRepository.count());
        statistics.setReportsHandled(reportRepository.countByStatus("RESOLVED"));
        
        return statistics;
    }
} 