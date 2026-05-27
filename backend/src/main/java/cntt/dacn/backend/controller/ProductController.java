package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.BookResponse;
import cntt.dacn.backend.dto.ProductPageResponse;
import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.repository.ProductRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ProductPageResponse getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Float minRating,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        Pageable pageable = PageRequest.of(safePage, safeSize, buildSort(sort));
        var products = productRepository.findAll(
                buildSpecification(category, minPrice, maxPrice, minRating),
                pageable
        );
        var items = products.getContent()
                .stream()
                .map(BookResponse::from)
                .toList();

        return new ProductPageResponse(
                items,
                products.getNumber(),
                products.getSize(),
                products.getTotalPages(),
                products.getTotalElements()
        );
    }

//    LỌC SẢN PHẨM

    private Specification<Book> buildSpecification(
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Float minRating
    ) {
        Specification<Book> specification = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();

        if (category != null && !category.isBlank()) {
            specification = specification.and(hasCategory(category));
        }

        if (minPrice != null) {
            specification = specification.and(priceGreaterThanOrEqual(minPrice));
        }

        if (maxPrice != null) {
            specification = specification.and(priceLessThanOrEqual(maxPrice));
        }

        if (minRating != null) {
            specification = specification.and(ratingGreaterThanOrEqual(minRating));
        }

        return specification;
    }

    private Specification<Book> hasCategory(String category) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.join("category").get("categoryName"), category);
    }

    private Specification<Book> priceGreaterThanOrEqual(BigDecimal minPrice) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    private Specification<Book> priceLessThanOrEqual(BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    private Specification<Book> ratingGreaterThanOrEqual(Float minRating) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("averageRating"), minRating);
    }

    private Sort buildSort(String sort) {
        return switch (sort) {
            case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
            case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
            case "ratingDesc", "popular" -> Sort.by(Sort.Direction.DESC, "averageRating");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
