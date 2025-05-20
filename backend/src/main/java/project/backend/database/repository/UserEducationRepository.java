package project.backend.database.repository;

import org.springframework.data.repository.CrudRepository;
import project.backend.database.model.UserEducation;
import project.backend.database.model.User;
import java.util.List;

public interface UserEducationRepository extends CrudRepository<UserEducation, Integer> {
    List<UserEducation> findByUser(User user);
}
