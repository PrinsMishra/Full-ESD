package com.example.esd3.service;

import com.example.esd3.entity.Employee;
import com.example.esd3.repository.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Employee addEmployee(Employee employee) {

        // Encrypt password before saving
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));

        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new com.example.esd3.exception.ResourceNotFoundException(
                        "Employee not found with id: " + id));
    }
}
