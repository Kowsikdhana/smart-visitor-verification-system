package com.example.visitor.entity;

/**
 * Enumeration representing the category of the visitor.
 * Used for fast categorization and specific workflows (e.g., DELIVERY priority fast-track).
 */
public enum VisitorType {
    REGULAR,
    DELIVERY,
    MAINTENANCE,
    GUEST,
    OTHER
}
