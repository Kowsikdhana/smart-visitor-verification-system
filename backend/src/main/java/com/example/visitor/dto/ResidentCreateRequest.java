package com.example.visitor.dto;

import com.example.visitor.entity.ResidentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ResidentCreateRequest {

    @NotBlank(message = "Resident name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+ -]{7,15}$", message = "Phone number must be valid (7-15 digits)")
    private String phone;

    private String email;

    @NotBlank(message = "Apartment/Unit number is required (e.g. A-101)")
    private String apartmentUnit;

    @NotBlank(message = "Building/Block name is required (e.g. Tower A)")
    private String buildingBlock;

    private ResidentStatus status = ResidentStatus.ACTIVE;

    public ResidentCreateRequest() {
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
}
