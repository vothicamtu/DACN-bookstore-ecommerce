package cntt.dacn.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="authors")
public class Author {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name="author_name")
    private String authorName;

    private String biography;

    @Column(name="created_at")
    private LocalDateTime createdAt;
}