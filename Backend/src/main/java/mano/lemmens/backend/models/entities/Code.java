package mano.lemmens.backend.models.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"owner", "name"}))
public class Code {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "owner", nullable = false)
    private User owner;
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String codeHash;
    @Column(nullable = false)
    private String codeSalt;
    @Column(nullable = false)
    private String codeIv;
    @Column(name = "name", nullable = false)
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
