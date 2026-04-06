package com.coursemanagement.exception;

public class DuplicateStudentIdException extends RuntimeException {

    public DuplicateStudentIdException(String message) {
        super(message);
    }
}
