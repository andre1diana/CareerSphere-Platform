package project.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendContactEmail(String name, String email, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo("andrei.diana370@gmail.com");
            mailMessage.setFrom(email);
            mailMessage.setSubject("New Contact Form Submission");
            mailMessage.setText("Name: " + name + "\n" + "Email: " + email + "\n" + "Message:\n" + message);
            
            emailSender.send(mailMessage);
        } catch (Throwable e) {
            // Log the exception
            System.err.println("Error sending email: " + e.getMessage());
            // Rethrow the exception or handle it appropriately
            throw new RuntimeException("Error sending email", e);
        }
    }
}
