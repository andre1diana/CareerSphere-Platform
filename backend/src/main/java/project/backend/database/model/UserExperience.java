package project.backend.database.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class UserExperience {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String companyName;
    private String position;
    private String startDate;
    private String endDate;

    public UserExperience(User user, String companyName, String position, String startDate, String endDate) {
        this.user = user;
        this.companyName = companyName;
        this.position = position;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    public UserExperience() {
        // Default constructor
    }
    public void setUser(User user) {
        this.user = user;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    public void setPosition(String position) {
        this.position = position;
    }
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
    public User getUser() {
        return user;
    }
    public String getCompanyName() {
        return companyName;
    }
    public String getPosition() {
        return position;
    }
    public String getStartDate() {
        return startDate;
    }
    public String getEndDate() {
        return endDate;
    }

    public Integer getId() {
        return id;
    }
}
