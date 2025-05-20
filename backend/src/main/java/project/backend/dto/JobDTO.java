package project.backend.dto;

import lombok.Data;

@Data
public class JobDTO {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private String salary;
} 