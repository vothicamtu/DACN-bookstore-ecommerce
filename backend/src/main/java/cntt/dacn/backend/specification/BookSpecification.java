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
}