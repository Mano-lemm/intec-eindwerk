package mano.lemmens.backend.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(unique = true, nullable = false)
    private String name;
    @Column(nullable = false)
    private String pwdHash;

    private User name(String name){
        this.name = name;
        return this;
    }

    private User pwdHash(String pwdHash){
        this.pwdHash = pwdHash;
        return this;
    }
}
