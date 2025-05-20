package project.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.backend.database.model.Message;
import project.backend.database.model.User;
import project.backend.database.repository.MessageRepository;
import project.backend.service.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> request) {
        try {
            Integer senderId = (Integer) request.get("senderId");
            Integer receiverId = (Integer) request.get("receiverId");
            String messageText = (String) request.get("message");

            if (senderId == null || receiverId == null || messageText == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            User sender = userService.getUserById(senderId).orElse(null);
            User receiver = userService.getUserById(receiverId).orElse(null);

            if (sender == null || receiver == null) {
                return ResponseEntity.notFound().build();
            }

            Message message = new Message(
                sender,
                receiver,
                messageText,
                LocalDateTime.now()
            );
            Message savedMessage = messageRepository.save(message);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending message: " + e.getMessage());
        }
    }

    @GetMapping("/conversation/{userId1}/{userId2}")
    public ResponseEntity<?> getConversation(@PathVariable Integer userId1, @PathVariable Integer userId2) {
        try {
            List<Message> messages = StreamSupport.stream(messageRepository.findAll().spliterator(), false)
                .filter(msg -> 
                    (msg.getSenderId().getId().equals(userId1) && msg.getReceiverId().getId().equals(userId2)) ||
                    (msg.getSenderId().getId().equals(userId2) && msg.getReceiverId().getId().equals(userId1))
                )
                .collect(Collectors.toList());

            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching conversation: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserConversations(@PathVariable Integer userId) {
        try {
            List<Message> messages = StreamSupport.stream(messageRepository.findAll().spliterator(), false)
                .filter(msg -> 
                    msg.getSenderId().getId().equals(userId) || 
                    msg.getReceiverId().getId().equals(userId)
                )
                .collect(Collectors.toList());

            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching user conversations: " + e.getMessage());
        }
    }
} 