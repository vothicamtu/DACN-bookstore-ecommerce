package cntt.dacn.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "discount_percent")
    private Integer discountPercent = 0;

    private Integer stock = 0;

    private String translator;

    @Column(name = "page_count")
    private Integer pageCount;

    private String size;

    @Column(name = "publish_date")
    private LocalDate publishDate;

    @Column(name = "average_rating")
    private Float averageRating = 0f;

    @Column(name = "sold_count")
    private Integer soldCount = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Foreign Key -> categories(id)
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Foreign Key -> authors(id)
    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    // Foreign Key -> publishers(id)
    @ManyToOne
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;
}
