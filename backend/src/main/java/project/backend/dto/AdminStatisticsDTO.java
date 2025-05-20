package project.backend.dto;

import lombok.Data;

@Data
public class AdminStatisticsDTO {
    private long totalUsers;
    private long totalCompanies;
    private long totalJobPostings;
    private long reportsHandled;
} 