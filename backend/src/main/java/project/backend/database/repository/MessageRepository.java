package project.backend.database.repository;

import org.springframework.data.repository.CrudRepository;

import project.backend.database.model.Message;

public interface MessageRepository extends CrudRepository<Message, Long> {
    ;
    
}
