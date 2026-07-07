package com.chamodi.weekly_report_backend.exception;



public class UnauthorizedActionException extends RuntimeException {
    public UnauthorizedActionException(String message) {
        super(message);
    }
}