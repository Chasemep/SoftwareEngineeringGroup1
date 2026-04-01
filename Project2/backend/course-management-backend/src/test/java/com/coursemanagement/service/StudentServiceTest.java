package com.coursemanagement.service;

import com.coursemanagement.dto.StatsResponseDTO;
import com.coursemanagement.dto.StudentRequestDTO;
import com.coursemanagement.dto.StudentResponseDTO;
import com.coursemanagement.exception.DuplicateStudentIdException;
import com.coursemanagement.exception.StudentNotFoundException;
import com.coursemanagement.model.Student;
import com.coursemanagement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student student1;
    private Student student2;
    private StudentRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        student1 = new Student(1L, 1, "Alice", null, "Smith", 92.0);
        student2 = new Student(2L, 2, "Bob", "M", "Jones", 78.5);
        requestDTO = new StudentRequestDTO(3, "Jane", "A", "Doe", 87.5);
    }

    @Test
    void createStudent_success() {
        when(studentRepository.existsByStudentId(3)).thenReturn(false);
        Student saved = new Student(3L, 3, "Jane", "A", "Doe", 87.5);
        when(studentRepository.save(any(Student.class))).thenReturn(saved);

        StudentResponseDTO result = studentService.createStudent(requestDTO);

        assertNotNull(result);
        assertEquals(3L, result.getId());
        assertEquals(3, result.getStudentId());
        assertEquals("Jane", result.getFirstName());
        assertEquals("A", result.getMiddleName());
        assertEquals("Doe", result.getLastName());
        assertEquals(87.5, result.getScore());
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void createStudent_duplicateStudentId_throwsException() {
        when(studentRepository.existsByStudentId(3)).thenReturn(true);

        assertThrows(DuplicateStudentIdException.class,
                () -> studentService.createStudent(requestDTO));

        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void getAllStudents_returnsSortedList() {
        when(studentRepository.findAllByOrderByStudentIdAsc())
                .thenReturn(Arrays.asList(student1, student2));

        List<StudentResponseDTO> result = studentService.getAllStudents();

        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getStudentId());
        assertEquals(2, result.get(1).getStudentId());
    }

    @Test
    void getAllStudents_emptyList() {
        when(studentRepository.findAllByOrderByStudentIdAsc())
                .thenReturn(List.of());

        List<StudentResponseDTO> result = studentService.getAllStudents();

        assertEquals(0, result.size());
    }

    @Test
    void getStudentById_found() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student1));

        StudentResponseDTO result = studentService.getStudentById(1L);

        assertNotNull(result);
        assertEquals("Alice", result.getFirstName());
        assertNull(result.getMiddleName());
    }

    @Test
    void getStudentById_notFound_throwsException() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(StudentNotFoundException.class,
                () -> studentService.getStudentById(99L));
    }

    @Test
    void deleteStudent_success() {
        when(studentRepository.existsById(1L)).thenReturn(true);

        studentService.deleteStudent(1L);

        verify(studentRepository).deleteById(1L);
    }

    @Test
    void deleteStudent_notFound_throwsException() {
        when(studentRepository.existsById(99L)).thenReturn(false);

        assertThrows(StudentNotFoundException.class,
                () -> studentService.deleteStudent(99L));

        verify(studentRepository, never()).deleteById(any());
    }

    @Test
    void getStats_withStudents() {
        when(studentRepository.count()).thenReturn(2L);
        when(studentRepository.findAverageScore()).thenReturn(85.25);

        StatsResponseDTO result = studentService.getStats();

        assertEquals(2, result.getCount());
        assertEquals(85.25, result.getAverageScore());
    }

    @Test
    void getStats_noStudents() {
        when(studentRepository.count()).thenReturn(0L);
        when(studentRepository.findAverageScore()).thenReturn(null);

        StatsResponseDTO result = studentService.getStats();

        assertEquals(0, result.getCount());
        assertNull(result.getAverageScore());
    }
}
