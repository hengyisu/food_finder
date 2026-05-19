package com.example.iac.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String fab, String phase) {
        super("Resource not found with fab: " + fab + " and phase: " + phase);
    }
}