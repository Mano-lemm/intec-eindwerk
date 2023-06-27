package mano.lemmens.backend.models.repositories;

import mano.lemmens.backend.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, PagingAndSortingRepository<User, Long> {
    Optional<User> findByName(String name);
    boolean existsByName(String name);
}
