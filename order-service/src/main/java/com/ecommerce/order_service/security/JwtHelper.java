package com.ecommerce.order_service.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

// Extracts the authenticated user's email from the security context.
// We use email as a stable identifier across services.
@Component
public class JwtHelper {

    private final JwtUtil jwtUtil;

    public JwtHelper(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public String getCurrentUserEmail() {
        return (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // Extracts userId from the JWT token stored in authentication details
    public Long getCurrentUserId() {
        UsernamePasswordAuthenticationToken auth =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder
                        .getContext()
                        .getAuthentication();
        String jwt = (String) auth.getDetails();
        return jwtUtil.extractUserId(jwt);
    }
}