package com.example.visitor.service;

import com.example.visitor.dto.ResidentCreateRequest;
import com.example.visitor.dto.ResidentResponse;
import com.example.visitor.entity.Resident;
import com.example.visitor.entity.ResidentStatus;
import com.example.visitor.exception.ResourceNotFoundException;
import com.example.visitor.repository.ResidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ResidentService contains business operations for resident management.
 *
 * Concepts explained:
 * - @Service: Stereotype annotation indicating this class houses domain business logic.
 * - @Transactional: Ensures operations are executed within a database transaction boundary.
 */
@Service
public class ResidentService {

    private final ResidentRepository residentRepository;

    public ResidentService(ResidentRepository residentRepository) {
        this.residentRepository = residentRepository;
    }

    @Transactional(readOnly = true)
    public List<ResidentResponse> getAllResidents() {
        return residentRepository.findAll().stream()
                .map(ResidentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResidentResponse> searchResidents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return residentRepository.findByStatus(ResidentStatus.ACTIVE).stream()
                    .map(ResidentResponse::fromEntity)
                    .collect(Collectors.toList());
        }
        return residentRepository.searchResidents(query.trim()).stream()
                .map(ResidentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResidentResponse getResidentById(Long id) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + id));
        return ResidentResponse.fromEntity(resident);
    }

    @Transactional
    public ResidentResponse createResident(ResidentCreateRequest request) {
        Resident resident = new Resident(
                request.getName(),
                request.getPhone(),
                request.getEmail(),
                request.getApartmentUnit(),
                request.getBuildingBlock(),
                request.getStatus() != null ? request.getStatus() : ResidentStatus.ACTIVE
        );
        Resident saved = residentRepository.save(resident);
        return ResidentResponse.fromEntity(saved);
    }
}
