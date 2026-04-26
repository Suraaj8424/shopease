package com.ecommerce.order_service.repository;

import com.ecommerce.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // All orders for a specific user, newest first
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}