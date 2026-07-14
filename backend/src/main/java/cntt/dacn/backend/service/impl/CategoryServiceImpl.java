package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.dto.request.CategoryRequest;
import cntt.dacn.backend.entity.Category;
import cntt.dacn.backend.repository.CategoryRepository;
import cntt.dacn.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Page<Category> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    @Override
    public Category create(CategoryRequest request) {
        // Kiểm tra trùng lặp tên danh mục (Sử dụng hàm bạn đã định nghĩa trong Repository)
        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new RuntimeException("Tên danh mục đã tồn tại!");
        }

        Category category = new Category();
        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());

        return categoryRepository.save(category);
    }

    @Override
    public Category update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));

        // Cập nhật thông tin
        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());

        return categoryRepository.save(category);
    }

    @Override
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy danh mục với ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}