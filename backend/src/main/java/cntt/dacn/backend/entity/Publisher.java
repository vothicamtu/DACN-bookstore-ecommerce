package cntt.dacn.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="publishers")
public class Publisher {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name="publisher_name")

    private String publisherName;

    private String email;

    private String phone;

    private String address;

    @Column(name="created_at")
    private LocalDateTime createdAt;
}