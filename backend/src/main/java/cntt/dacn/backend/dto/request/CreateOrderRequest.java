package cntt.dacn.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid email format")
    private String customerEmail;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Shipping method is required")
    private String shippingMethod;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String note;

    private List<Long> cartItemIds;
}
