package com.example.visitor.service;

import com.example.visitor.dto.DashboardResponse;
import com.example.visitor.dto.VisitResponse;
import com.example.visitor.entity.VisitStatus;
import com.example.visitor.entity.VisitorType;
import com.example.visitor.repository.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DashboardService computes operational security statistics in real time.
 */
@Service
public class DashboardService {

    private final VisitRepository visitRepository;

    public DashboardService(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboardStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);

        long currentlyInside = visitRepository.countByStatus(VisitStatus.CHECKED_IN);
        long todayVisits = visitRepository.countByCheckInTimeBetween(startOfToday, endOfToday);
        long todayCheckOuts = visitRepository.countByStatusAndCheckOutTimeBetween(VisitStatus.CHECKED_OUT, startOfToday, endOfToday);
        long todayDeliveries = visitRepository.countByVisitorTypeAndCheckInTimeBetween(VisitorType.DELIVERY, startOfToday, endOfToday);

        List<VisitResponse> recentVisits = visitRepository.findTop10ByOrderByCheckInTimeDesc().stream()
                .map(VisitResponse::fromEntity)
                .collect(Collectors.toList());

        return new DashboardResponse(
                currentlyInside,
                todayVisits,
                todayCheckOuts,
                todayDeliveries,
                recentVisits
        );
    }
}
