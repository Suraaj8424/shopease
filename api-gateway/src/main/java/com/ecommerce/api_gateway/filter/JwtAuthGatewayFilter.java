package com.ecommerce.api_gateway.filter;

import com.ecommerce.api_gateway.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class JwtAuthGatewayFilter extends
        AbstractGatewayFilterFactory<JwtAuthGatewayFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    public JwtAuthGatewayFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().toString();

            // If route is not secured, pass through immediately
            if (!config.isSecured()) {
                log.debug("Public route — skipping JWT check: {}", path);
                return chain.filter(exchange);
            }

            // Check Authorization header exists
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                log.warn("Missing Authorization header for: {}", path);
                return onError(exchange, HttpStatus.UNAUTHORIZED,
                        "Missing Authorization header");
            }

            String authHeader = request.getHeaders()
                    .getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("Invalid Authorization format for: {}", path);
                return onError(exchange, HttpStatus.UNAUTHORIZED,
                        "Invalid Authorization format");
            }

            String token = authHeader.substring(7);

            // Validate the token
            if (!jwtUtil.validateToken(token)) {
                log.warn("Invalid or expired JWT for: {}", path);
                return onError(exchange, HttpStatus.UNAUTHORIZED,
                        "Invalid or expired token");
            }

            // Token is valid — extract user info and forward as headers
            // Downstream services can read X-User-Email and X-User-Role
            String email = jwtUtil.extractEmail(token);
            String role  = jwtUtil.extractRole(token);

            log.debug("JWT valid — user={}, role={}, path={}", email, role, path);

            // Mutate request to add user info headers for downstream services
            ServerHttpRequest mutatedRequest = exchange.getRequest()
                    .mutate()
                    .header("X-User-Email", email)
                    .header("X-User-Role", role)
                    .build();

            return chain.filter(exchange.mutate()
                    .request(mutatedRequest)
                    .build());
        };
    }

    // Returns an error response and completes the exchange
    private Mono<Void> onError(ServerWebExchange exchange,
                                HttpStatus status,
                                String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add("Content-Type", "application/json");

        String body = String.format(
                "{\"status\":%d,\"error\":\"%s\",\"message\":\"%s\"}",
                status.value(), status.getReasonPhrase(), message);

        byte[] bytes = body.getBytes();
        org.springframework.core.io.buffer.DataBuffer buffer =
                response.bufferFactory().wrap(bytes);

        return response.writeWith(Mono.just(buffer));
    }

    // Config class — maps the 'secured' property from application.yml
    public static class Config {
        private boolean secured = true;

        public boolean isSecured() { return secured; }
        public void setSecured(boolean secured) { this.secured = secured; }
    }
}