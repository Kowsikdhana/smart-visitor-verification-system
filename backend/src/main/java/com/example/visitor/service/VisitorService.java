package com.example.visitor.service;

import com.example.visitor.dto.VisitorResponse;
import com.example.visitor.entity.Visitor;
import com.example.visitor.repository.VisitorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * VisitorService manages visitor identities.
 *
 * Fast Delivery / Repeat Visitor Optimization:
 * When security enters a phone number, this service looks up existing records.
 * If found, returning visitor information is auto-populated to save time.
 */
@Service
public class VisitorService {

    private final VisitorRepository visitorRepository;

    public VisitorService(VisitorRepository visitorRepository) {
        this.visitorRepository = visitorRepository;
    }

    @Transactional(readOnly = true)
    public Optional<VisitorResponse> findByPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return Optional.empty();
        }
        return visitorRepository.findByPhone(phone.trim())
                .map(VisitorResponse::fromEntity);
    }

    @Transactional
    public Visitor getOrCreateVisitor(String fullName, String phone, String company, String vehicleNumber) {
        String cleanPhone = phone.trim();
        Optional<Visitor> existing = visitorRepository.findByPhone(cleanPhone);

        if (existing.isPresent()) {
            Visitor visitor = existing.get();
            // Update name, company or vehicle if new information is provided
            if (fullName != null && !fullName.trim().isEmpty()) {
                visitor.setFullName(fullName.trim());
            }
            if (company != null && !company.trim().isEmpty()) {
                visitor.setCompany(company.trim());
            }
            if (vehicleNumber != null && !vehicleNumber.trim().isEmpty()) {
                visitor.setVehicleNumber(vehicleNumber.trim());
            }
            return visitorRepository.save(visitor);
        } else {
            Visitor newVisitor = new Visitor(
                    fullName != null ? fullName.trim() : "Unknown",
                    cleanPhone,
                    company != null ? company.trim() : null,
                    vehicleNumber != null ? vehicleNumber.trim() : null
            );
            return visitorRepository.save(newVisitor);
        }
    }

    @Transactional(readOnly = true)
    public List<VisitorResponse> getAllVisitors() {
        return visitorRepository.findAll().stream()
                .map(VisitorResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
