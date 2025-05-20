package project.backend.database.repository;

import org.springframework.data.repository.CrudRepository;
import project.backend.database.model.UserExperience;
import project.backend.database.model.User;
import java.util.List;

public interface UserExperienceRepository extends CrudRepository<UserExperience, Integer> {
    List<UserExperience> findByUser(User user);
}
