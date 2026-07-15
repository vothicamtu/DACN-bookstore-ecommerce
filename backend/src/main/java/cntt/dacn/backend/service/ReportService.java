package cntt.dacn.backend.service;

import java.util.List;
import java.util.Map;

public interface ReportService {

    // Trả về Map chứa 4 chỉ số tổng quan
    Map<String, Object> getSummaryReport();

    // Trả về List chứa doanh thu 12 tháng
    List<Map<String, Object>> getMonthlyRevenue(int year);

    // Trả về List chứa thông tin Top 5 sách bán chạy
    List<Map<String, Object>> getTopSellingBooks();
}