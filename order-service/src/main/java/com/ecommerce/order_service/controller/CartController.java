package com.ecommerce.order_service.controller;

import com.ecommerce.order_service.dto.CartItemRequest;
import com.ecommerce.order_service.dto.CartItemResponse;
import com.ecommerce.order_service.security.JwtHelper;
import com.ecommerce.order_service.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final JwtHelper jwtHelper;

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart() {
        Long userId = jwtHelper.getCurrentUserId();
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItemResponse> addToCart(
            @Valid @RequestBody CartItemRequest request) {
        Long userId = jwtHelper.getCurrentUserId();
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItemResponse> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        Long userId = jwtHelper.getCurrentUserId();
        return ResponseEntity.ok(cartService.updateCartItem(userId, cartItemId, quantity));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartItemId) {
        Long userId = jwtHelper.getCurrentUserId();
        cartService.removeFromCart(userId, cartItemId);
        return ResponseEntity.noContent().build();
    }
}