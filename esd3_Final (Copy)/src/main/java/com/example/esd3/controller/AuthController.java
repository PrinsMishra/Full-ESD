//
//
package com.example.esd3.controller;

import com.example.esd3.dto.AuthRequest;
import com.example.esd3.dto.AuthRequest;
import com.example.esd3.dto.AuthResponse;
import com.example.esd3.entity.Employee;
import com.example.esd3.repository.EmployeeRepository;
import com.example.esd3.security.JwtService;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(EmployeeRepository employeeRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    // ✔ Only allow employee<anything>@gmail.com
    private boolean isEmployeeEmail(String email) {
        return email.matches("^employee.+@gmail\\.com$");
    }

    // ---------------------------------------------------
    // NORMAL LOGIN
    // ---------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        Optional<Employee> optionalEmployee = employeeRepository.findByEmail(request.getEmail());

        if (optionalEmployee.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email"));
        }

        Employee emp = optionalEmployee.get();

        // ✔ email prefix/domain restriction
        if (!isEmployeeEmail(emp.getEmail())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Only employee*@gmail.com can login"));
        }

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), emp.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid password"));
        }

        // Generate JWT
        String token = jwtService.generateToken(emp);

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .employeeId(emp.getId())
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .email(emp.getEmail())
                .build();

        return ResponseEntity.ok(response);
    }

    // ---------------------------------------------------
    // GOOGLE LOGIN
    // ---------------------------------------------------
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        try {
            String idTokenString = request.get("token");

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(
                            "751273023660-8l3nsso812bbmdnr7sc8pgb105u7lp0c.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid Google token"));
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");
            String picture = (String) payload.get("picture");

            // ✔ email restriction for Google login
            if (!isEmployeeEmail(email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Only employee*@gmail.com can sign in with Google"));
            }

            Optional<Employee> optionalEmployee = employeeRepository.findByEmail(email);

            Employee emp;

            // Auto-create employee for Google login if not found
            if (optionalEmployee.isEmpty()) {
                emp = Employee.builder()
                        .email(email)
                        .firstName(firstName)
                        .lastName(lastName)
                        .photographPath(picture)
                        .googleUser(true)
                        .password(null) // Google users have no password
                        .build();

                emp = employeeRepository.save(emp);
            } else {
                emp = optionalEmployee.get();
            }

            // Generate JWT
            String token = jwtService.generateToken(emp);

            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .employeeId(emp.getId())
                    .firstName(emp.getFirstName())
                    .lastName(emp.getLastName())
                    .email(emp.getEmail())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Google Authentication Failed"));
        }
    }
}
