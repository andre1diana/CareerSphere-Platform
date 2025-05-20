package project.backend.database.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class UserEducation {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private int id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String institutionName;
    private String degree;
    private String startDate;
    private String endDate;
    private String fieldOfStudy;

    public UserEducation(User user, String institutionName, String degree, String startDate, String endDate, String fieldOfStudy) {
        this.institutionName = institutionName;
        this.degree = degree;
        this.startDate = startDate;
        this.endDate = endDate;
        this.fieldOfStudy = fieldOfStudy;
    }
    public UserEducation() {
        // Default constructor
    }

    public void setUser(User user) {
        this.user = user;
    }
    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }
    public void setDegree(String degree) {
        this.degree = degree;
    }
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }
    public User getUser() {
        return user;
    }
    public String getInstitutionName() {
        return institutionName;
    }
    public String getDegree() {
        return degree;
    }
    public String getStartDate() {
        return startDate;
    }
    public String getEndDate() {
        return endDate;
    }
    public String getFieldOfStudy() {
        return fieldOfStudy;
    }
    public int getId() {
        return id;
    }
}
