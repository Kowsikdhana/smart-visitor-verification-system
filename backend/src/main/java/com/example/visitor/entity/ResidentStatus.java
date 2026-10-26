package com.example.visitor.entity;

/**
 * Status of a resident/tenant in the community.
 * Visitors can only be checked in for ACTIVE residents.
 */
public enum ResidentStatus {
    ACTIVE,
    INACTIVE
}
