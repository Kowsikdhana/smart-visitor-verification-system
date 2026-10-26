package com.example.visitor.dto;

import com.example.visitor.entity.VisitorType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * VisitCreateRequest encapsulates all data needed to register and check in a visitor.
 *
 * Backend Validation rules:
 * - @NotBlank: Cannot be null or just whitespace
 * - @Pattern: Validates phone number format
 * - @NotNull: Ensures foreign keys and enums are present
 */
public class VisitCreateRequest {

    @NotBlank(message = "Visitor name is required")
    private String visitorName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+ -]{7,15}$", message = "Phone number must be valid (7 to 15 digits)")
    private String phone;

    private String company; // e.g. Amazon, Swiggy, Dunzo

    private String vehicleNumber; // e.g. MH12AB1234

    @NotNull(message = "Resident to visit is required")
    private Long residentId;

    @NotNull(message = "Visitor type is required (REGULAR, DELIVERY, MAINTENANCE, GUEST, OTHER)")
    private VisitorType visitorType = VisitorType.REGULAR;

    @NotBlank(message = "Purpose of visit is required")
    private String purpose;

    private String notes;

    public VisitCreateRequest() {
    }

    public String getVisitorName() {
        return visitorName;
    }

    public void setVisitorName(String visitorName) {
        this.visitorName = visitorName;
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

    public Long getResidentId() {
        return residentId;
    }

    public void setResidentId(Long residentId) {
        this.residentId = residentId;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
