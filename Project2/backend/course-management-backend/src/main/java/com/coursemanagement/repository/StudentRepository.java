package com.coursemanagement.repository;

import com.coursemanagement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findAllByOrderByStudentIdAsc();

    Optional<Student> findByStudentId(Integer studentId);

    boolean existsByStudentId(Integer studentId);

    @Query("SELECT AVG(s.score) FROM Student s")
    Double findAverageScore();
}
