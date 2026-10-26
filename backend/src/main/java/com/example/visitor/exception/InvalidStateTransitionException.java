package com.example.visitor.exception;

/**
 * Thrown when an illegal state change is attempted (e.g. Checking out an already CHECKED_OUT visit).
 */
public class InvalidStateTransitionException extends RuntimeException {

    public InvalidStateTransitionException(String message) {
        super(message);
    }
}
