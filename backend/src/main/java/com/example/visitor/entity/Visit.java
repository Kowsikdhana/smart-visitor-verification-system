package com.example.visitor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Visit Entity represents a specific check-in session/event.
 *
 * JPA Relationship concepts explained:
 * - @ManyToOne: Multiple visit records can belong to the same Visitor (a person can visit many times)
 *   and to the same Resident (a resident can receive many visitors).
 * - @JoinColumn: Specifies the foreign key column name in the "visits" table.
 * - Eager fetching is used here because whenever a visit pass or history row is loaded,
 *   we almost always need the visitor's name and the resident's flat number.
 */
@Entity
@Table(name = "visits", indexes = {
    @Index(name = "idx_visit_status", columnList = "status"),
    @Index(name = "idx_visit_check_in", columnList = "check_in_time"),
    @Index(name = "idx_visit_pass_code", columnList = "pass_code", unique = true)
})
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pass_code", nullable = false, unique = true, length = 30)
    private String passCode; // e.g., "VIS-2026-8921"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "visitor_id", nullable = false)
    private Visitor visitor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident;

    @Enumerated(EnumType.STRING)
    @Column(name = "visitor_type", nullable = false, length = 30)
    private VisitorType visitorType = VisitorType.REGULAR;

    @Column(nullable = false, length = 255)
    private String purpose;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VisitStatus status = VisitStatus.CHECKED_IN;

    @Column(name = "check_in_time", nullable = false)
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Visit() {
    }

    public Visit(String passCode, Visitor visitor, Resident resident, VisitorType visitorType, String purpose, String notes) {
        this.passCode = passCode;
        this.visitor = visitor;
        this.resident = resident;
        this.visitorType = visitorType != null ? visitorType : VisitorType.REGULAR;
        this.purpose = purpose;
        this.notes = notes;
        this.status = VisitStatus.CHECKED_IN;
        this.checkInTime = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.checkInTime == null) {
            this.checkInTime = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassCode() {
        return passCode;
    }

    public void setPassCode(String passCode) {
        this.passCode = passCode;
    }

    public Visitor getVisitor() {
        return visitor;
    }

    public void setVisitor(Visitor visitor) {
        this.visitor = visitor;
    }

    public Resident getResident() {
        return resident;
    }

    public void setResident(Resident resident) {
        this.resident = resident;
    }

    public VisitorType getVisitorType() {
        return visitorType;
    }

    public void setVisitorType(VisitorType visitorType) {
        this.visitorType = visitorType;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public VisitStatus getStatus() {
        return status;
    }

    public void setStatus(VisitStatus status) {
        this.status = status;
    }

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalDateTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
