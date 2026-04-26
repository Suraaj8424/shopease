package com.ecommerce.order_service.service;

import com.ecommerce.order_service.dto.CartItemRequest;
import com.ecommerce.order_service.dto.CartItemResponse;
import com.ecommerce.order_service.dto.ProductResponse;
import com.ecommerce.order_service.feign.ProductClient;
import com.ecommerce.order_service.model.CartItem;
import com.ecommerce.order_service.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductClient productClient;  // OpenFeign

    // ── GET CART ─────────────────────────────────────────────────────────────

    public List<CartItemResponse> getCart(Long userId) {
        return cartItemRepository.findByUserId(userId)
                .stream()
                .map(item -> {
                    // Call product-service via Feign to get current price/name
                    ProductResponse product = productClient.getProductById(item.getProductId());
                    return buildCartItemResponse(item, product);
                })
                .collect(Collectors.toList());
    }

    // ── ADD TO CART ───────────────────────────────────────────────────────────

    public CartItemResponse addToCart(Long userId, CartItemRequest request) {
        // Verify product exists
        ProductResponse product = productClient.getProductById(request.getProductId());

        // If item already in cart → increment quantity
        CartItem cartItem = cartItemRepository
                .findByUserIdAndProductId(userId, request.getProductId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return existing;
                })
                .orElse(CartItem.builder()
                        .userId(userId)
                        .productId(request.getProductId())
                        .quantity(request.getQuantity())
                        .build());

        CartItem saved = cartItemRepository.save(cartItem);
        log.info("Added to cart: userId={}, productId={}", userId, request.getProductId());
        return buildCartItemResponse(saved, product);
    }

    // ── UPDATE QUANTITY ───────────────────────────────────────────────────────

    public CartItemResponse updateCartItem(Long userId, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .filter(item -> item.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItem.setQuantity(quantity);
        CartItem updated = cartItemRepository.save(cartItem);

        ProductResponse product = productClient.getProductById(updated.getProductId());
        return buildCartItemResponse(updated, product);
    }

    // ── REMOVE ITEM ───────────────────────────────────────────────────────────

    public void removeFromCart(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .filter(item -> item.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cartItemRepository.delete(cartItem);
        log.info("Removed cart item: id={}", cartItemId);
    }

    // ── CLEAR CART ────────────────────────────────────────────────────────────

    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
        log.info("Cleared cart for userId={}", userId);
    }

    // ── HELPER ────────────────────────────────────────────────────────────────

    private CartItemResponse buildCartItemResponse(CartItem item, ProductResponse product) {
        BigDecimal subtotal = product.getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productPrice(product.getPrice())
                .quantity(item.getQuantity())
                .subtotal(subtotal)
                .build();
    }
}