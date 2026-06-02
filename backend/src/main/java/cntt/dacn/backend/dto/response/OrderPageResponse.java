package cntt.dacn.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPageResponse {
    private List<OrderResponse> items;
    private int page;
    private int size;
    private int totalPages;
    private long totalItems;
    private long processingItems;
}
