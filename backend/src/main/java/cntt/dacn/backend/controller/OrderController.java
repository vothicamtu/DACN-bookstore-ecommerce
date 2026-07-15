package cntt.dacn.backend.controller;

import cntt.dacn.backend.config.VNPayConfig;
import cntt.dacn.backend.dto.request.CreateOrderRequest;
import cntt.dacn.backend.dto.request.OrderStatusUpdateRequest;
import cntt.dacn.backend.dto.response.ApiResponse;
import cntt.dacn.backend.dto.response.OrderPageResponse;
import cntt.dacn.backend.dto.response.OrderResponse;
import cntt.dacn.backend.dto.response.OrderReviewItemResponse;
import cntt.dacn.backend.dto.response.PagedResponse;
import cntt.dacn.backend.entity.OrderStatus;
import cntt.dacn.backend.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest orderRequest, HttpServletRequest request) throws Exception {
        // 1. Lưu đơn hàng vào DB
        OrderResponse order = orderService.createOrder(orderRequest);

        // 2. Kiểm tra nếu phương thức thanh toán là ATM (Thanh toán qua VNPay)
        if ("banking".equals(orderRequest.getPaymentMethod())) {
            long amount = order.getTotalAmount().longValue() * 100;
            String vnp_TxnRef = String.valueOf(order.getOrderId());

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", "2.1.0");
            vnp_Params.put("vnp_Command", "pay");
            vnp_Params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + vnp_TxnRef);
            vnp_Params.put("vnp_OrderType", "other");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
            vnp_Params.put("vnp_IpAddr", "127.0.0.1");

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
            String queryUrl = query.toString();
            String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
            String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl + "&vnp_SecureHash=" + vnp_SecureHash;

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .data(Map.of("order", order, "paymentUrl", paymentUrl))
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.builder().success(true).data(Map.of("order", order)).build());
    }

    // API xác nhận thanh toán khi VNPay gọi về - ĐÃ FIX LỖI TYPE MISMATCH
    @GetMapping("/vnpay-callback")
    public ResponseEntity<?> vnpayCallback(HttpServletRequest request) {
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_TxnRef = request.getParameter("vnp_TxnRef");

        if ("00".equals(vnp_ResponseCode)) {
            Long orderId = Long.parseLong(vnp_TxnRef);

            // Khởi tạo DTO để truyền vào Service thay vì truyền String
            OrderStatusUpdateRequest statusUpdate = new OrderStatusUpdateRequest();
            statusUpdate.setStatus(OrderStatus.CONFIRMED);

            // Cập nhật trạng thái đơn hàng thành CONFIRMED
            orderService.updateOrderStatus(orderId, statusUpdate);

            return ResponseEntity.ok(ApiResponse.builder().success(true).message("Thanh toán thành công").build());
        }
        return ResponseEntity.ok(ApiResponse.builder().success(false).message("Thanh toán thất bại").build());
    }

    @GetMapping
    public OrderPageResponse getOrders(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return orderService.getOrders(userId, status, page, size);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long orderId
    ) {
        OrderResponse response = orderService.getOrderById(orderId);

        return ResponseEntity.ok(
                ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .message("Order retrieved successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<OrderResponse> response = orderService.getMyOrders(page, size);

        return ResponseEntity.ok(
                ApiResponse.<PagedResponse<OrderResponse>>builder()
                        .success(true)
                        .message("Orders retrieved successfully")
                        .data(response)
                        .build()
        );
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        OrderResponse response = orderService.updateOrderStatus(orderId, request);

        return ResponseEntity.ok(
                ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .message("Order status updated")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/{orderId}/review-items")
    public ResponseEntity<ApiResponse<List<OrderReviewItemResponse>>> getReviewItems(
            @PathVariable Long orderId
    ) {
        List<OrderReviewItemResponse> response = orderService.getReviewItems(orderId);

        return ResponseEntity.ok(
                ApiResponse.<List<OrderReviewItemResponse>>builder()
                        .success(true)
                        .message("Review items retrieved successfully")
                        .data(response)
                        .build()
        );
    }
}