package project.backend.database.repository;

import org.springframework.data.repository.CrudRepository;
import project.backend.database.model.Notification;
import java.util.List;

public interface NotificationRepository extends CrudRepository<Notification, Integer> {
    // Custom query methods can be defined here if needed
    

    // Example: Find notifications by user ID
    // List<Notification> findByUserId(int userId);
    
    List<Notification> findByUserId_IdOrderByCreatedAtDesc(Integer userId);
}
