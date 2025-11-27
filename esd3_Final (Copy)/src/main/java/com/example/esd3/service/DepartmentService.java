package com.example.esd3.service;


import com.example.esd3.entity.Department;
import com.example.esd3.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department addDepartment(Department dept) {
        return departmentRepository.save(dept);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
}
