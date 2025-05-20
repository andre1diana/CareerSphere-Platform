package project.backend.database.repository;

import org.springframework.data.repository.CrudRepository;
import project.backend.database.model.User;
import project.backend.database.enums.Roles;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
    Optional<User> findById(long id);
    List<User> findByRole(Roles role);
    List<User> findByNameContainingIgnoreCase(String name);
}
