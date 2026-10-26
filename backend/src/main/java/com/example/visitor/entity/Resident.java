package com.example.visitor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Resident Entity represents an occupant/tenant or office employee.
 * Security guards verify visitors against residents before granting entry.
 */
@Entity
@Table(name = "residents", indexes = {
    @Index(name = "idx_resident_search", columnList = "name, apartment_unit")
})
public class Resident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(name = "apartment_unit", nullable = false, length = 50)
    private String apartmentUnit; // e.g., "Flat 302", "Suite 4B"

    @Column(name = "building_block", nullable = false, length = 50)
    private String buildingBlock; // e.g., "Tower A", "North Wing"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ResidentStatus status = ResidentStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Resident() {
    }

    public Resident(String name, String phone, String email, String apartmentUnit, String buildingBlock, ResidentStatus status) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.apartmentUnit = apartmentUnit;
        this.buildingBlock = buildingBlock;
        this.status = status != null ? status : ResidentStatus.ACTIVE;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getApartmentUnit() {
        return apartmentUnit;
    }

    public void setApartmentUnit(String apartmentUnit) {
        this.apartmentUnit = apartmentUnit;
    }

    public String getBuildingBlock() {
        return buildingBlock;
    }

    public void setBuildingBlock(String buildingBlock) {
        this.buildingBlock = buildingBlock;
    }

    public ResidentStatus getStatus() {
        return status;
    }

    public void setStatus(ResidentStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
