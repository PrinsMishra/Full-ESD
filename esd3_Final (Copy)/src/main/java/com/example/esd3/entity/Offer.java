package com.example.esd3.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String organisation; // Required field

    @ElementCollection
    private List<String> domains; // Multiple or none (empty list allowed)

    @ElementCollection
    private List<String> specialisations; // Multiple or none (empty list OK)

    @Column(nullable = true)
    private Integer minGrade; // Optional field

    @Column(nullable = true)
    private Integer maxIntake; // Optional field

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    @JsonIgnore
    private Employee createdBy;
}
