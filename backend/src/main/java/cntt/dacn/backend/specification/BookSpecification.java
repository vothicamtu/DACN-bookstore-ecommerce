package cntt.dacn.backend.specification;

import cntt.dacn.backend.entity.Book;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class BookSpecification {

    private BookSpecification() {
    }

    public static Specification<Book> searchBooks(

            String keyword,

            Long categoryId,

            BigDecimal minPrice,

            BigDecimal maxPrice
    ) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates =
                    new ArrayList<>();


            // SEARCH TITLE OR AUTHOR
            if (keyword != null &&
                    !keyword.isBlank()) {

                Predicate titlePredicate =
                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        root.get("title")
                                ),
                                "%" +
                                        keyword.toLowerCase()
                                        + "%"
                        );

                Predicate authorPredicate =
                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        root.get("author")
                                                .get("authorName")
                                ),
                                "%" +
                                        keyword.toLowerCase()
                                        + "%"
                        );

                predicates.add(
                        criteriaBuilder.or(
                                titlePredicate,
                                authorPredicate
                        )
                );
            }


            // FILTER CATEGORY
            if (categoryId != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("category")
                                        .get("id"),
                                categoryId
                        )
                );
            }


            // FILTER MIN PRICE
            if (minPrice != null) {

                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("price"),
                                minPrice
                        )
                );
            }


            // FILTER MAX PRICE
            if (maxPrice != null) {

                predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(
                                root.get("price"),
                                maxPrice
                        )
                );
            }

            return criteriaBuilder.and(
                    predicates.toArray(
                            new Predicate[0]
                    )
            );
        };
    }

    public static Specification<Book> filterByCategory(String category) {
        return (root, query, criteriaBuilder) -> {
            if (category == null || category.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String normalizedCategory =
                    category.trim()
                            .toLowerCase()
                            .replace(" ", "-");

            var categoryName =
                    criteriaBuilder.lower(
                            root.join("category")
                                    .get("categoryName")
                    );

            var categorySlug =
                    criteriaBuilder.function(
                            "replace",
                            String.class,
                            categoryName,
                            criteriaBuilder.literal(" "),
                            criteriaBuilder.literal("-")
                    );

            return criteriaBuilder.or(
                    criteriaBuilder.equal(
                            categoryName,
                            category.trim().toLowerCase()
                    ),
                    criteriaBuilder.equal(
                            categorySlug,
                            normalizedCategory
                    )
            );
        };
    }

    public static Specification<Book> filterByCategoryId(Long categoryId) {
        return (root, query, criteriaBuilder) -> {
            if (categoryId == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("category")
                            .get("id"),
                    categoryId
            );
        };
    }

    public static Specification<Book> filterBooks(
            String keyword,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Float minRating
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates =
                    new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                String pattern =
                        "%" + keyword.toLowerCase() + "%";

                predicates.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get("title")),
                                        pattern
                                ),
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(
                                                root.join("author")
                                                        .get("authorName")
                                        ),
                                        pattern
                                )
                        )
                );
            }

            if (minPrice != null) {
                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("price"),
                                minPrice
                        )
                );
            }

            if (maxPrice != null) {
                predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(
                                root.get("price"),
                                maxPrice
                        )
                );
            }

            if (minRating != null) {
                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("averageRating"),
                                minRating
                        )
                );
            }

            return criteriaBuilder.and(
                    predicates.toArray(
                            new Predicate[0]
                    )
            );
        };
    }
}
