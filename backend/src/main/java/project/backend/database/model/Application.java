package project.backend.database.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import project.backend.database.enums.ApplicationStatus;

@Entity
public class Application {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "job_offer_id", nullable = true)
    private JobOffer jobOffer;

    private ApplicationStatus status;

    public Application(User user, JobOffer jobOffer, ApplicationStatus status) {
        this.user = user;
        this.jobOffer = jobOffer;
        this.status = status;
    }

    public Application() {
        // Default constructor for JPA
    }
    public int getId() {
        return id;
    }
    public User getUser() {
        return user;
    }
    public JobOffer getJobOffer() {
        return jobOffer;
    }
    public ApplicationStatus getStatus() {
        return status;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public void setJobOffer(JobOffer jobOffer) {
        this.jobOffer = jobOffer;
    }
    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

}
