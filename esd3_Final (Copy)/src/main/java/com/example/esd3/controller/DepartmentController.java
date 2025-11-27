package com.example.esd3.controller;


import com.example.esd3.entity.Department;
import com.example.esd3.service.DepartmentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@SecurityRequirement(name = "bearerAuth")

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // Add department → POST /api/departments/add
    @PostMapping("/add")
    public Department addDepartment(@RequestBody Department dept) {
        return departmentService.addDepartment(dept);
    }

    // Get all departments → GET /api/departments/get
    @GetMapping("/get")
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }
}
