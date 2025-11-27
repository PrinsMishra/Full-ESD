package com.example.esd3.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = true)
    private String password;

    private String title;

    @Column(nullable = true)
    private String photographPath;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Builder.Default
    private boolean googleUser = false;
}