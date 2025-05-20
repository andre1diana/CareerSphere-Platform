package project.backend.database.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import project.backend.database.enums.ReportType;

@Entity
public class Report {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporterId;

    @ManyToOne
    @JoinColumn(name = "reported_id", nullable = false)
    private User reportedId;

    private ReportType reportType;
    private String description;
    private String status; // "Pending", "Resolved", "Rejected"

    public Report(User reporterId, User reportedId, ReportType reportType, String description, String status) {
        this.reporterId = reporterId;
        this.reportedId = reportedId;
        this.reportType = reportType;
        this.description = description;
        this.status = status;
    }
    public Report() {
        // Default constructor
    }

    public int getId() {
        return id;
    }
    public User getReporterId() {
        return reporterId;
    }
    public User getReportedId() {
        return reportedId;
    }
    public ReportType getReportType() {
        return reportType;
    }
    public String getDescription() {
        return description;
    }
    public String getStatus() {
        return status;
    }
    public void setReporterId(User reporterId) {
        this.reporterId = reporterId;
    }
    public void setReportedId(User reportedId) {
        this.reportedId = reportedId;
    }
    public void setReportType(ReportType reportType) {
        this.reportType = reportType;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setStatus(String status) {
        this.status = status;
    }

}
