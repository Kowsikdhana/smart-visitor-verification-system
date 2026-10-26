package com.example.visitor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Visitor Entity represents the identity of a visitor/delivery agent.
 *
 * Interview Tip - Database Normalization:
 * Notice that we decouple Visitor (person identity) from Visit (event).
 * When an Amazon delivery person visits 5 times a week, their identity is stored
 * once here. Their phone number is unique, allowing the guard to quickly auto-fill
 * their details upon repeat arrival.
 */
@Entity
@Table(name = "visitors", indexes = {
    @Index(name = "idx_visitor_phone", columnList = "phone", unique = true)
})
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @Column(length = 100)
    private String company; // e.g. "Amazon", "Swiggy", "Urban Company", "Guest"

    @Column(name = "vehicle_number", length = 30)
    private String vehicleNumber; // e.g. "TN-01-AB-1234"

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Visitor() {
    }

    public Visitor(String fullName, String phone, String company, String vehicleNumber) {
        this.fullName = fullName;
        this.phone = phone;
        this.company = company;
        this.vehicleNumber = vehicleNumber;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
