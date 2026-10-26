package com.example.visitor.dto;

import com.example.visitor.entity.Visit;
import com.example.visitor.entity.VisitStatus;
import com.example.visitor.entity.VisitorType;

import java.time.LocalDateTime;

/**
 * VisitResponse provides a flattened, frontend-friendly view of a visit.
 *
 * Interview Tip - Eliminating N+1 / Circular Serialization:
 * Directly serializing JPA entities can trigger infinite recursion if bidirectional
 * relationships exist, or leak internal database column structures.
 * Flattening into VisitResponse provides an exact contract tailored for the UI.
 */
public class VisitResponse {

    private Long id;
    private String passCode;

    // Visitor Details
    private Long visitorId;
    private String visitorName;
    private String phone;
    private String company;
    private String vehicleNumber;

    // Resident Details
    private Long residentId;
    private String residentName;
    private String apartmentUnit;
    private String buildingBlock;
    private String residentPhone;

    // Visit Metadata
    private VisitorType visitorType;
    private String purpose;
    private VisitStatus status;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String notes;

    public VisitResponse() {
    }

    public static VisitResponse fromEntity(Visit visit) {
        if (visit == null) return null;

        VisitResponse dto = new VisitResponse();
        dto.setId(visit.getId());
        dto.setPassCode(visit.getPassCode());

        if (visit.getVisitor() != null) {
            dto.setVisitorId(visit.getVisitor().getId());
            dto.setVisitorName(visit.getVisitor().getFullName());
            dto.setPhone(visit.getVisitor().getPhone());
            dto.setCompany(visit.getVisitor().getCompany());
            dto.setVehicleNumber(visit.getVisitor().getVehicleNumber());
        }

        if (visit.getResident() != null) {
            dto.setResidentId(visit.getResident().getId());
            dto.setResidentName(visit.getResident().getName());
            dto.setApartmentUnit(visit.getResident().getApartmentUnit());
            dto.setBuildingBlock(visit.getResident().getBuildingBlock());
            dto.setResidentPhone(visit.getResident().getPhone());
        }

        dto.setVisitorType(visit.getVisitorType());
        dto.setPurpose(visit.getPurpose());
        dto.setStatus(visit.getStatus());
        dto.setCheckInTime(visit.getCheckInTime());
        dto.setCheckOutTime(visit.getCheckOutTime());
        dto.setNotes(visit.getNotes());

        return dto;
    }

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

    public Long getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(Long visitorId) {
        this.visitorId = visitorId;
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

    public String getResidentName() {
        return residentName;
    }

    public void setResidentName(String residentName) {
        this.residentName = residentName;
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

    public String getResidentPhone() {
        return residentPhone;
    }

    public void setResidentPhone(String residentPhone) {
        this.residentPhone = residentPhone;
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
}
