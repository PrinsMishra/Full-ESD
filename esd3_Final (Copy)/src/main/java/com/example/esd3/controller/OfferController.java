package com.example.esd3.controller;



import com.example.esd3.entity.Employee;
import com.example.esd3.entity.Offer;
import com.example.esd3.repository.EmployeeRepository;
import com.example.esd3.security.JwtService;
import com.example.esd3.service.OfferService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/offers")
@SecurityRequirement(name = "bearerAuth")
public class OfferController {

    private final OfferService offerService;
    private final JwtService jwtService;
    private final EmployeeRepository employeeRepository;

    public OfferController(OfferService offerService,
                           JwtService jwtService,
                           EmployeeRepository employeeRepository) {
        this.offerService = offerService;
        this.jwtService = jwtService;
        this.employeeRepository = employeeRepository;
    }

    // 1. Create Offer (Requires JWT)
    @PostMapping("/add")
    public ResponseEntity<?> addOffer(@RequestBody Offer offer,
                                      HttpServletRequest request) {

        // Extract JWT from Authorization header
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid token");
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        // Find Employee who created offer
        Optional<Employee> employee = employeeRepository.findByEmail(email);

        if (employee.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid employee");
        }

        Offer savedOffer = offerService.createOffer(offer, employee.get());
        return ResponseEntity.ok(savedOffer);
    }

    // 2. Get All Offers
    @GetMapping("/get")
    public ResponseEntity<List<Offer>> getOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }
}