package com.ecommerce.order_service.controller;

import com.ecommerce.order_service.dto.OrderResponse;
import com.ecommerce.order_service.dto.PaymentRequest;
import com.ecommerce.order_service.dto.PaymentResponse;
import com.ecommerce.order_service.security.JwtHelper;
import com.ecommerce.order_service.service.OrderService;
import com.ecommerce.order_service.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;
    private final JwtHelper jwtHelper;

    // Place order from current cart
    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder() {
        Long userId = jwtHelper.getCurrentUserId();
        return ResponseEntity.ok(orderService.placeOrder(userId));
    }

    // Get all orders for the logged-in user
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        Long userId = jwtHelper.getCurrentUserId();
        return ResponseEntity.ok(orderService.getMyOrders(userId));
    }

    // Get a specific order
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId) {
        Long userId = jwtHelper.getCurrentUserId();
        return ResponseEntity.ok(orderService.getOrderById(orderId, userId));
    }

    // Process payment for an order
    @PostMapping("/payment")
    public ResponseEntity<PaymentResponse> processPayment(
            @Valid @RequestBody PaymentRequest request) {
        Long userId = jwtHelper.getCurrentUserId();
        return ResponseEntity.ok(paymentService.processPayment(request, userId));
    }
}