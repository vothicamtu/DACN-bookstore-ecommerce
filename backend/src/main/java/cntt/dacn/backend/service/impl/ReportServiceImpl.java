package cntt.dacn.backend.service.impl;

import cntt.dacn.backend.repository.BookRepository;
import cntt.dacn.backend.repository.OrderRepository;
import cntt.dacn.backend.repository.UserRepository;
import cntt.dacn.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Override
    public Map<String, Object> getSummaryReport() {
        Map<String, Object> summary = new HashMap<>();

        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long totalProducts = bookRepository.count();

        // Tính tổng doanh thu từ các đơn hàng thành công (DELIVERED)
        double totalRevenue = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() != null && "DELIVERED".equals(order.getStatus().toString()))
                .mapToDouble(order -> order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0)
                .sum();

        summary.put("totalRevenue", totalRevenue);
        summary.put("totalOrders", totalOrders);
        summary.put("totalUsers", totalUsers);
        summary.put("totalProducts", totalProducts);

        return summary;
    }

    @Override
    public List<Map<String, Object>> getMonthlyRevenue(int year) {
        List<Map<String, Object>> monthlyData = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            final int currentMonth = month;

            double revenue = orderRepository.findAll().stream()
                    .filter(order -> order.getCreatedAt() != null
                            && order.getCreatedAt().getYear() == year
                            && order.getCreatedAt().getMonthValue() == currentMonth
                            && order.getStatus() != null
                            && "DELIVERED".equals(order.getStatus().toString()))
                    .mapToDouble(order -> order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0)
                    .sum();

            Map<String, Object> data = new HashMap<>();
            data.put("month", "Tháng " + month);
            data.put("revenue", revenue);
            monthlyData.add(data);
        }

        return monthlyData;
    }

    @Override
    public List<Map<String, Object>> getTopSellingBooks() {
        Map<Long, Integer> bookSalesQty = new HashMap<>();
        Map<Long, Double> bookSalesRevenue = new HashMap<>();

        // Tính toán lượt bán và doanh thu thực tế từ database
        orderRepository.findAll().stream()
                .filter(order -> order.getStatus() != null && "DELIVERED".equals(order.getStatus().toString()))
                .filter(order -> order.getOrderItems() != null)
                .flatMap(order -> order.getOrderItems().stream())
                .forEach(item -> {
                    if (item.getBook() != null) {
                        Long bookId = item.getBook().getId();
                        int qty = item.getQuantity() != null ? item.getQuantity() : 0;
                        double price = item.getPrice() != null ? item.getPrice().doubleValue() : 0.0;

                        bookSalesQty.put(bookId, bookSalesQty.getOrDefault(bookId, 0) + qty);
                        bookSalesRevenue.put(bookId, bookSalesRevenue.getOrDefault(bookId, 0.0) + (qty * price));
                    }
                });

        // Sắp xếp tìm ra top 5 ID sách bán nhiều nhất
        List<Map.Entry<Long, Integer>> sortedSales = new ArrayList<>(bookSalesQty.entrySet());
        sortedSales.sort((a, b) -> b.getValue().compareTo(a.getValue()));

        List<Map<String, Object>> top5Result = new ArrayList<>();
        int limit = Math.min(sortedSales.size(), 5);

        for (int i = 0; i < limit; i++) {
            Long bookId = sortedSales.get(i).getKey();
            int finalI = i;
            bookRepository.findById(bookId).ifPresent(book -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", book.getId());
                map.put("title", book.getTitle());
                map.put("authorName", book.getAuthor() != null ? book.getAuthor().getName() : "Nhiều tác giả");
                map.put("categoryName", book.getCategory() != null ? book.getCategory().getName() : "Chưa phân loại");
                map.put("quantitySold", sortedSales.get(finalI).getValue());
                map.put("totalRevenue", bookSalesRevenue.getOrDefault(bookId, 0.0));
                top5Result.add(map);
            });
        }

        return top5Result;
    }
}