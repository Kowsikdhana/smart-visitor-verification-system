package com.example.visitor.entity;

/**
 * Enumeration representing the lifecycle state of a visit.
 *
 * Valid State Transitions:
 * CHECKED_IN -> CHECKED_OUT
 * CHECKED_IN -> CANCELLED
 *
 * An already CHECKED_OUT visit cannot be checked out again (enforced in Service layer).
 */
public enum VisitStatus {
    CHECKED_IN,
    CHECKED_OUT,
    CANCELLED
}
