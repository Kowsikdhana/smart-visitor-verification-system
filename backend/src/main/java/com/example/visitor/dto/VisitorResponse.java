package com.example.visitor.dto;

import com.example.visitor.entity.Visitor;

import java.time.LocalDateTime;

public class VisitorResponse {

    private Long id;
    private String fullName;
    private String phone;
    private String company;
    private String vehicleNumber;
    private LocalDateTime createdAt;

    public VisitorResponse() {
    }

    public static VisitorResponse fromEntity(Visitor visitor) {
        if (visitor == null) return null;
        VisitorResponse dto = new VisitorResponse();
        dto.setId(visitor.getId());
        dto.setFullName(visitor.getFullName());
        dto.setPhone(visitor.getPhone());
        dto.setCompany(visitor.getCompany());
        dto.setVehicleNumber(visitor.getVehicleNumber());
        dto.setCreatedAt(visitor.getCreatedAt());
        return dto;
    }

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
