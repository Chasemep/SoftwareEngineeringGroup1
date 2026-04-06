package com.coursemanagement.service;

import com.coursemanagement.dto.StatsResponseDTO;
import com.coursemanagement.dto.StudentRequestDTO;
import com.coursemanagement.dto.StudentResponseDTO;
import com.coursemanagement.exception.DuplicateStudentIdException;
import com.coursemanagement.exception.StudentNotFoundException;
import com.coursemanagement.model.Student;
import com.coursemanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public StudentResponseDTO createStudent(StudentRequestDTO request) {
        if (studentRepository.existsByStudentId(request.getStudentId())) {
            throw new DuplicateStudentIdException(
                    "Student with studentId " + request.getStudentId() + " already exists");
        }

        Student student = new Student();
        student.setStudentId(request.getStudentId());
        student.setFirstName(request.getFirstName());
        student.setMiddleName(request.getMiddleName());
        student.setLastName(request.getLastName());
        student.setScore(request.getScore());

        Student saved = studentRepository.save(student);
        return toResponseDTO(saved);
    }

    @Override
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAllByOrderByStudentIdAsc()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public StudentResponseDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id " + id));
        return toResponseDTO(student);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException("Student not found with id " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    public StatsResponseDTO getStats() {
        long count = studentRepository.count();
        Double average = studentRepository.findAverageScore();
        return new StatsResponseDTO(count, average);
    }

    private StudentResponseDTO toResponseDTO(Student student) {
        return new StudentResponseDTO(
                student.getId(),
                student.getStudentId(),
                student.getFirstName(),
                student.getMiddleName(),
                student.getLastName(),
                student.getScore()
        );
    }
}
