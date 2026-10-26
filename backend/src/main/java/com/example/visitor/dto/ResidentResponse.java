package com.example.visitor.dto;

import com.example.visitor.entity.Resident;
import com.example.visitor.entity.ResidentStatus;

import java.time.LocalDateTime;

public class ResidentResponse {

    private Long id;
    private String name;
    private String phone;
    private String email;
    private String apartmentUnit;
    private String buildingBlock;
    private ResidentStatus status;
    private LocalDateTime createdAt;

    public ResidentResponse() {
    }

    public static ResidentResponse fromEntity(Resident resident) {
        if (resident == null) return null;
        ResidentResponse dto = new ResidentResponse();
        dto.setId(resident.getId());
        dto.setName(resident.getName());
        dto.setPhone(resident.getPhone());
        dto.setEmail(resident.getEmail());
        dto.setApartmentUnit(resident.getApartmentUnit());
        dto.setBuildingBlock(resident.getBuildingBlock());
        dto.setStatus(resident.getStatus());
        dto.setCreatedAt(resident.getCreatedAt());
        return dto;
    }

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
