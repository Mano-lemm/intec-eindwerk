package mano.lemmens.backend.models.repositories;

import mano.lemmens.backend.models.entities.Code;
import mano.lemmens.backend.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

public interface CodeRepository extends JpaRepository<Code, Long>, PagingAndSortingRepository<Code, Long> {
    Optional<Code> findByOwnerAndName(User owner, String name);

    @Query("select new Code(c_.id, c_.owner, c_.codeHash, c_.codeSalt, c_.codeIv, c_.name) from Code c_ left join User u_ on c_.owner.id = u_.id where u_.id = ?1")
    List<Code> findCodesByOwnerId(Long ownerId);
}
