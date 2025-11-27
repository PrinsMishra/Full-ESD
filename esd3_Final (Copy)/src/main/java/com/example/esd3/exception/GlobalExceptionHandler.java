package com.example.esd3.exception;

import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle specific exceptions
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException exception, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    // Handle database constraint violations (foreign key, unique, etc.)
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolation(
            org.springframework.dao.DataIntegrityViolationException exception,
            WebRequest request) {

        String message = "Database constraint violation";

        // Extract more specific error message
        if (exception.getCause() != null && exception.getCause().getMessage() != null) {
            String causeMessage = exception.getCause().getMessage();

            if (causeMessage.contains("foreign key constraint")) {
                message = "Invalid reference: The referenced entity does not exist. Please ensure all related entities exist before creating this record.";
            } else if (causeMessage.contains("Duplicate entry")) {
                message = "Duplicate entry: A record with this value already exists.";
            } else if (causeMessage.contains("cannot be null")) {
                message = "Required field is missing or null.";
            }
        }

        ErrorDetails errorDetails = new ErrorDetails(new Date(), message, request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // Handle validation errors
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(
            org.springframework.web.bind.MethodArgumentNotValidException exception,
            WebRequest request) {

        StringBuilder message = new StringBuilder("Validation failed: ");
        exception.getBindingResult().getFieldErrors().forEach(
                error -> message.append(error.getField()).append(" - ").append(error.getDefaultMessage()).append("; "));

        ErrorDetails errorDetails = new ErrorDetails(new Date(), message.toString(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // Handle global exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception exception, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
