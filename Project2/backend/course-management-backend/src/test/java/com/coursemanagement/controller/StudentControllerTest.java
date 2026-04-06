package com.coursemanagement.controller;

import com.coursemanagement.dto.StatsResponseDTO;
import com.coursemanagement.dto.StudentRequestDTO;
import com.coursemanagement.dto.StudentResponseDTO;
import com.coursemanagement.exception.DuplicateStudentIdException;
import com.coursemanagement.exception.GlobalExceptionHandler;
import com.coursemanagement.exception.StudentNotFoundException;
import com.coursemanagement.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StudentController.class)
@Import(GlobalExceptionHandler.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createStudent_validRequest_returns201() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO(3, "Jane", "A", "Doe", 87.5);
        StudentResponseDTO response = new StudentResponseDTO(1L, 3, "Jane", "A", "Doe", 87.5);

        when(studentService.createStudent(any(StudentRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.studentId", is(3)))
                .andExpect(jsonPath("$.firstName", is("Jane")))
                .andExpect(jsonPath("$.score", is(87.5)));
    }

    @Test
    void createStudent_missingFirstName_returns400() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO(3, "", "A", "Doe", 87.5);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.firstName").exists());
    }

    @Test
    void createStudent_studentIdTooHigh_returns400() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO(11, "Jane", null, "Doe", 87.5);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.studentId").exists());
    }

    @Test
    void createStudent_studentIdTooLow_returns400() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO(0, "Jane", null, "Doe", 87.5);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.studentId").exists());
    }

    @Test
    void createStudent_scoreTooHigh_returns400() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO(1, "Jane", null, "Doe", 101.0);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.score").exists());
    }

    @Test
    void createStudent_nullScore_returns400() throws Exception {
        String json = "{\"studentId\":1,\"firstName\":\"Jane\",\"lastName\":\"Doe\"}";

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.score").exists());
    }

    @Test
    void createStudent_duplicateStudentId_returns409() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO(3, "Jane", null, "Doe", 87.5);

        when(studentService.createStudent(any(StudentRequestDTO.class)))
                .thenThrow(new DuplicateStudentIdException("Student with studentId 3 already exists"));

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error", is("Student with studentId 3 already exists")));
    }

    @Test
    void getAllStudents_returnsList() throws Exception {
        List<StudentResponseDTO> students = Arrays.asList(
                new StudentResponseDTO(1L, 1, "Alice", null, "Smith", 92.0),
                new StudentResponseDTO(2L, 2, "Bob", "M", "Jones", 78.5)
        );
        when(studentService.getAllStudents()).thenReturn(students);

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].studentId", is(1)))
                .andExpect(jsonPath("$[1].studentId", is(2)));
    }

    @Test
    void getStudentById_found_returns200() throws Exception {
        StudentResponseDTO response = new StudentResponseDTO(1L, 1, "Alice", null, "Smith", 92.0);
        when(studentService.getStudentById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Alice")));
    }

    @Test
    void getStudentById_notFound_returns404() throws Exception {
        when(studentService.getStudentById(99L))
                .thenThrow(new StudentNotFoundException("Student not found with id 99"));

        mockMvc.perform(get("/api/students/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", is("Student not found with id 99")));
    }

    @Test
    void deleteStudent_success_returns204() throws Exception {
        doNothing().when(studentService).deleteStudent(1L);

        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteStudent_notFound_returns404() throws Exception {
        doThrow(new StudentNotFoundException("Student not found with id 99"))
                .when(studentService).deleteStudent(99L);

        mockMvc.perform(delete("/api/students/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getStats_returnsStats() throws Exception {
        when(studentService.getStats()).thenReturn(new StatsResponseDTO(5, 85.4));

        mockMvc.perform(get("/api/students/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count", is(5)))
                .andExpect(jsonPath("$.averageScore", is(85.4)));
    }

    @Test
    void getStats_empty_returnsZeroCount() throws Exception {
        when(studentService.getStats()).thenReturn(new StatsResponseDTO(0, null));

        mockMvc.perform(get("/api/students/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count", is(0)))
                .andExpect(jsonPath("$.averageScore").doesNotExist());
    }
}
