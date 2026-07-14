package cntt.dacn.backend.controller;

import cntt.dacn.backend.dto.request.CategoryRequest;
import cntt.dacn.backend.dto.response.ApiResponse;
import cntt.dacn.backend.entity.Category;
import cntt.dacn.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Category>>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categories = categoryService.findAll(pageable);

        ApiResponse<Page<Category>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy danh sách danh mục thành công");
        response.setData(categories);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody CategoryRequest request) {
        Category savedCategory = categoryService.create(request);

        ApiResponse<Category> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Thêm danh mục thành công");
        response.setData(savedCategory);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
        Category updatedCategory = categoryService.update(id, request);

        ApiResponse<Category> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật danh mục thành công");
        response.setData(updatedCategory);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);

        ApiResponse<Void> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Xóa danh mục thành công");

        return ResponseEntity.ok(response);
    }
}