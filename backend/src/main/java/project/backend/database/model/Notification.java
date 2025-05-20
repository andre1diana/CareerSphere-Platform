package project.backend.database.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String content;
    private LocalDateTime createdAt;
    private boolean isRead;

    public Notification(User user, String content, LocalDateTime createdAt, boolean isRead) {
        this.user = user;
        this.content = content;
        this.createdAt = createdAt;
        this.isRead = isRead;
    }
    public Notification() {
        // Default constructor for JPA
    }
    public int getId() {
        return id;
    }
    public User getUser() {
        return user;
    }
    public String getContent() {
        return content;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public boolean isRead() {
        return isRead;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public void setRead(boolean isRead) {
        this.isRead = isRead;}
}
