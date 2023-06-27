package mano.lemmens.backend.models.repositories;

import mano.lemmens.backend.models.entities.Code;
import mano.lemmens.backend.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface CodeRepository extends JpaRepository<Code, Long>, PagingAndSortingRepository<Code, Long> {
    Optional<Code> findByOwnerAndName(User owner, String name);
}
