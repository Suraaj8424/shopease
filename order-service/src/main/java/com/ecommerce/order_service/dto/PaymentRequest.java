package com.ecommerce.order_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    // Dummy payment — card number just for show, never stored
    private String cardNumber;
    private String cardHolder;
    private String expiryDate;
    private String cvv;
}