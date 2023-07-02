package mano.lemmens.backend.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"owner", "name"}))
public class Code {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "owner")
    private User owner;
    private String codeHash;
    private String codeSalt;
    private String codeIv;
    private String name;

    public Code id(Long id){
        this.id = id;
        return this;
    }

    public Code code(String codeHash){
        this.codeHash = codeHash;
        return this;
    }

    public Code name(String name){
        this.name = name;
        return this;
    }

    public Code owner(User owner){
        this.owner = owner;
        return this;
    }

    public Code iv(String iv){
        this.codeIv = iv;
        return this;
    }

    public Code salt(String salt){
        this.codeSalt = salt;
        return this;
    }
}
