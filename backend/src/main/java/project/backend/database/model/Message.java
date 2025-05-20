package project.backend.database.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    private String message;
    private LocalDateTime timestamp;

    public Message(User senderId, User receiverId, String message, LocalDateTime timestamp) {
        this.sender = senderId;
        this.receiver = receiverId;
        this.message = message;
        this.timestamp = timestamp;
    }
    public Message() {
        // Default constructor
    }

    public int getId() {
        return id;
    }
    public User getSenderId() {
        return sender;
    }
    public User getReceiverId() {
        return receiver;
    }
    public void setSenderId(User senderId) {
        this.sender = senderId;
    }
    public String getMessage() {
        return message;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setReceiverId(User receiverId) {
        this.receiver = receiverId;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

}
