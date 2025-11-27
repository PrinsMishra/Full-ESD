package com.example.esd3.security;

import com.example.esd3.entity.Employee;
import com.example.esd3.repository.EmployeeRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final EmployeeRepository employeeRepository;

    public JwtAuthenticationFilter(JwtService jwtService, EmployeeRepository employeeRepository) {
        this.jwtService = jwtService;
        this.employeeRepository = employeeRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        logger.info("Processing request: " + request.getMethod() + " " + requestURI);

        try {
            String jwt = getJwtFromRequest(request);

            if (jwt != null && !jwt.isEmpty()) {
                logger.info("JWT token found: " + jwt.substring(0, Math.min(20, jwt.length())) + "...");

                String email = jwtService.extractEmail(jwt);
                logger.info("Extracted email from token: " + email);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    Employee employee = employeeRepository.findByEmail(email).orElse(null);

                    if (employee != null) {
                        logger.info("Employee found: " + employee.getEmail() + " (ID: " + employee.getId() + ")");
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                employee, null, new ArrayList<>());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.info("Authentication set successfully for: " + email);
                    } else {
                        logger.warn("Employee not found in database for email: " + email);
                    }
                } else if (email == null) {
                    logger.warn("Could not extract email from token");
                } else {
                    logger.info("Authentication already exists in context");
                }
            } else {
                logger.warn("No JWT token found in Authorization header for: " + requestURI);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context for URI: " + requestURI, ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
