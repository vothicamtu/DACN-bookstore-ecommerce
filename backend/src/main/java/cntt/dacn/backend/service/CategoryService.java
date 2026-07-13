package cntt.dacn.backend.service;

import cntt.dacn.backend.dto.request.CategoryRequest;
import cntt.dacn.backend.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    Page<Category> findAll(Pageable pageable);

    Category create(CategoryRequest request);

    Category update(Long id, CategoryRequest request);

    void delete(Long id);
}