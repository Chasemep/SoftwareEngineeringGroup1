package com.coursemanagement.service;

import com.coursemanagement.dto.StatsResponseDTO;
import com.coursemanagement.dto.StudentRequestDTO;
import com.coursemanagement.dto.StudentResponseDTO;

import java.util.List;

public interface StudentService {

    StudentResponseDTO createStudent(StudentRequestDTO request);

    List<StudentResponseDTO> getAllStudents();

    StudentResponseDTO getStudentById(Long id);

    void deleteStudent(Long id);

    StatsResponseDTO getStats();
}
