package project.backend.database.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;

@Entity
public class Company {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private int id;

    private String companyName;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    private LocalDate createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;

    public int getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public int getUserId() {
        return userId.getId();
    }

    public User getUser() {
        return userId;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public Company(String companyName, LocalDate createdAt, User userId) {
        this.companyName = companyName;
        this.createdAt = createdAt;
        this.userId = userId;
    }

    public Company() {
        // Default constructor for JPA
    }
}
