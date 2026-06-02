package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.response.ProductPageResponse;
import cntt.dacn.backend.dto.response.ProductResponse;
import cntt.dacn.backend.entity.Author;
import cntt.dacn.backend.entity.Book;
import cntt.dacn.backend.entity.Category;
import cntt.dacn.backend.entity.Publisher;
import cntt.dacn.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductPageResponse getProducts(
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Float minRating,
            String keyword,
            String sort,
            int page,
            int size
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        Pageable pageable = PageRequest.of(safePage, safeSize, buildSort(sort));
        Page<Book> products = productRepository.findAll(
                buildSpecification(category, minPrice, maxPrice, minRating, keyword),
                pageable
        );
        List<ProductResponse> items = new ArrayList<>();

        for (Book book : products.getContent()) {
            items.add(toProductResponse(book));
        }

        return new ProductPageResponse(
                items,
                products.getNumber(),
                products.getSize(),
                products.getTotalPages(),
                products.getTotalElements()
        );
    }

    private ProductResponse toProductResponse(Book book) {
        Category category = book.getCategory();
        Author author = book.getAuthor();
        Publisher publisher = book.getPublisher();

        return new ProductResponse(
                book.getId(),
                book.getTitle(),
                book.getImageUrl(),
                book.getDescription(),
                book.getPrice(),
                book.getDiscountPercent(),
                book.getStock(),
                book.getTranslator(),
                book.getPageCount(),
                book.getSize(),
                book.getPublishDate(),
                book.getAverageRating(),
                category != null ? category.getId() : null,
                category != null ? category.getCategoryName() : null,
                author != null ? author.getId() : null,
                author != null ? author.getAuthorName() : null,
                publisher != null ? publisher.getId() : null,
                publisher != null ? publisher.getPublisherName() : null
        );
    }

//    LỌC
    private Specification<Book> buildSpecification(
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Float minRating,
            String keyword
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

        if (keyword != null && !keyword.isBlank()) {
            specification = specification.and(hasKeyword(keyword));
        }

        return specification;
    }

    private Specification<Book> hasKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            String pattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.join("author").get("authorName")), pattern)
            );
        };
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
        if ("priceAsc".equals(sort)) {
            return Sort.by(Sort.Direction.ASC, "price");
        }

        if ("priceDesc".equals(sort)) {
            return Sort.by(Sort.Direction.DESC, "price");
        }

        if ("bestseller".equals(sort)) {
            return Sort.by(Sort.Direction.DESC, "soldCount");
        }

        if ("newest".equals(sort)) {
            return Sort.by(Sort.Direction.DESC, "publishDate");
        }

        if ("ratingDesc".equals(sort) || "popular".equals(sort)) {
            return Sort.by(Sort.Direction.DESC, "averageRating");
        }

        return Sort.by(Sort.Direction.DESC, "createdAt");
    }
}
