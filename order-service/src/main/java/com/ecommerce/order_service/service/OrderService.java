package com.ecommerce.order_service.service;

import com.ecommerce.order_service.dto.OrderItemResponse;
import com.ecommerce.order_service.dto.OrderResponse;
import com.ecommerce.order_service.dto.ProductResponse;
import com.ecommerce.order_service.feign.ProductClient;
import com.ecommerce.order_service.model.*;
import com.ecommerce.order_service.repository.CartItemRepository;
import com.ecommerce.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductClient productClient;

    // ── PLACE ORDER ───────────────────────────────────────────────────────────

    @Transactional  // if anything fails, the whole operation rolls back
    public OrderResponse placeOrder(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty. Add items before placing an order.");
        }

        // Build order items + calculate total
        BigDecimal total = BigDecimal.ZERO;

        Order order = Order.builder()
                .userId(userId)
                .status(OrderStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .build();

        // Save order first to get the generated ID
        Order savedOrder = orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            ProductResponse product = productClient.getProductById(cartItem.getProductId());

            BigDecimal itemTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .productId(product.getId())
                    .productName(product.getName())
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .build();

            savedOrder.getItems().add(orderItem);
        }

        savedOrder.setTotalAmount(total);
        savedOrder.setStatus(OrderStatus.CONFIRMED);
        Order finalOrder = orderRepository.save(savedOrder);

        // Clear cart after order is placed
        cartItemRepository.deleteByUserId(userId);
        log.info("Order placed: id={}, userId={}, total={}", finalOrder.getId(), userId, total);

        return mapToOrderResponse(finalOrder);
    }

    // ── GET MY ORDERS ─────────────────────────────────────────────────────────

    public List<OrderResponse> getMyOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    // ── GET ORDER BY ID ───────────────────────────────────────────────────────

    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .filter(o -> o.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return mapToOrderResponse(order);
    }

    // ── MAPPER ────────────────────────────────────────────────────────────────

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .build();
    }
}