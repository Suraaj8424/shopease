package com.ecommerce.order_service.service;

import com.ecommerce.order_service.dto.PaymentRequest;
import com.ecommerce.order_service.dto.PaymentResponse;
import com.ecommerce.order_service.model.Order;
import com.ecommerce.order_service.model.Payment;
import com.ecommerce.order_service.model.PaymentStatus;
import com.ecommerce.order_service.repository.OrderRepository;
import com.ecommerce.order_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentResponse processPayment(PaymentRequest request, Long userId) {
        // Verify order belongs to this user
        Order order = orderRepository.findById(request.getOrderId())
                .filter(o -> o.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException(
                        "Order not found: " + request.getOrderId()));

        // Check if already paid
        paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
            if (p.getStatus() == PaymentStatus.SUCCESS) {
                throw new RuntimeException("Order already paid.");
            }
        });

        // ── Dummy Payment Logic ────────────────────────────────────────────
        // In production: call Stripe/Razorpay/PayPal SDK here.
        // We simulate success for all card numbers except "0000000000000000"
        boolean paymentSuccess = !request.getCardNumber()
                .equals("0000000000000000");

        PaymentStatus status = paymentSuccess
                ? PaymentStatus.SUCCESS
                : PaymentStatus.FAILED;

        String transactionId = paymentSuccess
                ? "TXN-" + UUID.randomUUID().toString().toUpperCase().substring(0, 12)
                : null;
        // ──────────────────────────────────────────────────────────────────

        Payment payment = Payment.builder()
                .orderId(order.getId())
                .amount(order.getTotalAmount())
                .status(status)
                .transactionId(transactionId)
                .paidAt(paymentSuccess ? LocalDateTime.now() : null)
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Payment processed: orderId={}, status={}, txn={}",
                order.getId(), status, transactionId);

        return PaymentResponse.builder()
                .id(saved.getId())
                .orderId(saved.getOrderId())
                .amount(saved.getAmount())
                .status(saved.getStatus())
                .transactionId(saved.getTransactionId())
                .paidAt(saved.getPaidAt())
                .message(paymentSuccess
                        ? "Payment successful! Transaction ID: " + transactionId
                        : "Payment failed. Please check your card details.")
                .build();
    }
}