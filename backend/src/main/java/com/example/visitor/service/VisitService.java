package com.example.visitor.service;

import com.example.visitor.dto.VisitCreateRequest;
import com.example.visitor.dto.VisitResponse;
import com.example.visitor.entity.*;
import com.example.visitor.exception.BadRequestException;
import com.example.visitor.exception.InvalidStateTransitionException;
import com.example.visitor.exception.ResourceNotFoundException;
import com.example.visitor.repository.ResidentRepository;
import com.example.visitor.repository.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * VisitService coordinates visit registration, state transitions (check-in/check-out),
 * and security pass issuance.
 *
 * Key Business Rules Enforced:
 * 1. Resident Verification: Visitors can only be admitted to ACTIVE residents.
 * 2. State Machine: Only a CHECKED_IN visitor can be CHECKED_OUT. Duplicate checkouts are rejected.
 * 3. Server-Generated Timestamps: Prevents client clock spoofing.
 */
@Service
public class VisitService {

    private final VisitRepository visitRepository;
    private final ResidentRepository residentRepository;
    private final VisitorService visitorService;

    public VisitService(VisitRepository visitRepository,
                        ResidentRepository residentRepository,
                        VisitorService visitorService) {
        this.visitRepository = visitRepository;
        this.residentRepository = residentRepository;
        this.visitorService = visitorService;
    }

    @Transactional
    public VisitResponse createVisit(VisitCreateRequest request) {
        // 1. Verify Resident existence and active status
        Resident resident = residentRepository.findById(request.getResidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + request.getResidentId()));

        if (resident.getStatus() != ResidentStatus.ACTIVE) {
            throw new BadRequestException("Cannot admit visitor: Resident (" + resident.getName() +
                    ", Unit " + resident.getApartmentUnit() + ") is currently INACTIVE.");
        }

        // 2. Fetch or create Visitor profile (decoupled normalization)
        Visitor visitor = visitorService.getOrCreateVisitor(
                request.getVisitorName(),
                request.getPhone(),
                request.getCompany(),
                request.getVehicleNumber()
        );

        // 3. Generate a human-readable unique digital pass code
        String passCode = generatePassCode();

        // 4. Construct Visit entity
        Visit visit = new Visit();
        visit.setPassCode(passCode);
        visit.setVisitor(visitor);
        visit.setResident(resident);
        visit.setVisitorType(request.getVisitorType() != null ? request.getVisitorType() : VisitorType.REGULAR);
        visit.setPurpose(request.getPurpose().trim());
        visit.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);
        visit.setStatus(VisitStatus.CHECKED_IN);
        visit.setCheckInTime(LocalDateTime.now());

        Visit savedVisit = visitRepository.save(visit);
        return VisitResponse.fromEntity(savedVisit);
    }

    @Transactional
    public VisitResponse checkOutVisit(Long visitId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visit record not found with id: " + visitId));

        // State Machine validation
        if (visit.getStatus() == VisitStatus.CHECKED_OUT) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a, dd MMM yyyy");
            String checkOutTimeStr = visit.getCheckOutTime() != null ?
                    visit.getCheckOutTime().format(formatter) : "earlier";
            throw new InvalidStateTransitionException("Visitor has already checked out at " + checkOutTimeStr);
        }

        if (visit.getStatus() == VisitStatus.CANCELLED) {
            throw new InvalidStateTransitionException("Cannot check out a cancelled visit.");
        }

        // Apply transition
        visit.setStatus(VisitStatus.CHECKED_OUT);
        visit.setCheckOutTime(LocalDateTime.now());

        Visit updated = visitRepository.save(visit);
        return VisitResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<VisitResponse> getCurrentVisits() {
        return visitRepository.findByStatusOrderByCheckInTimeDesc(VisitStatus.CHECKED_IN).stream()
                .map(VisitResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VisitResponse getVisitById(Long id) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visit record not found with id: " + id));
        return VisitResponse.fromEntity(visit);
    }

    @Transactional(readOnly = true)
    public VisitResponse getVisitByPassCode(String passCode) {
        Visit visit = visitRepository.findByPassCode(passCode)
                .orElseThrow(() -> new ResourceNotFoundException("Pass code not found: " + passCode));
        return VisitResponse.fromEntity(visit);
    }

    @Transactional(readOnly = true)
    public List<VisitResponse> filterVisits(VisitorType type, VisitStatus status, String dateStr, String query) {
        LocalDateTime startOfDay = null;
        LocalDateTime endOfDay = null;

        if (dateStr != null && !dateStr.trim().isEmpty()) {
            try {
                LocalDate date = LocalDate.parse(dateStr.trim());
                startOfDay = date.atStartOfDay();
                endOfDay = date.atTime(LocalTime.MAX);
            } catch (Exception ignored) {
                // If date parsing fails, ignore date filter
            }
        }

        return visitRepository.filterVisits(type, status, startOfDay, endOfDay, query != null ? query.trim() : null)
                .stream()
                .map(VisitResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Generates a unique, friendly pass code (e.g., "VIS-20260928-4821")
     */
    private String generatePassCode() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomPart = ThreadLocalRandom.current().nextInt(1000, 9999);
        String candidate = "VIS-" + datePart + "-" + randomPart;

        // Ensure uniqueness
        while (visitRepository.findByPassCode(candidate).isPresent()) {
            randomPart = ThreadLocalRandom.current().nextInt(1000, 9999);
            candidate = "VIS-" + datePart + "-" + randomPart;
        }

        return candidate;
    }
}
