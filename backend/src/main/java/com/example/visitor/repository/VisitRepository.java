package com.example.visitor.repository;

import com.example.visitor.entity.Visit;
import com.example.visitor.entity.VisitStatus;
import com.example.visitor.entity.VisitorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * VisitRepository manages queries for visitor sessions, gate tracking, and audit history.
 */
@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {

    // Find all visitors currently inside
    List<Visit> findByStatusOrderByCheckInTimeDesc(VisitStatus status);

    // Find visit by unique digital pass code
    Optional<Visit> findByPassCode(String passCode);

    // Dashboard metrics
    long countByStatus(VisitStatus status);

    long countByCheckInTimeBetween(LocalDateTime start, LocalDateTime end);

    long countByStatusAndCheckOutTimeBetween(VisitStatus status, LocalDateTime start, LocalDateTime end);

    long countByVisitorTypeAndCheckInTimeBetween(VisitorType visitorType, LocalDateTime start, LocalDateTime end);

    List<Visit> findTop10ByOrderByCheckInTimeDesc();

    /**
     * Advanced filter query for Visitor History.
     * Uses COALESCE / IS NULL logic so any filter parameter can be null/optional.
     */
    @Query("SELECT v FROM Visit v WHERE " +
           "(:type IS NULL OR v.visitorType = :type) AND " +
           "(:status IS NULL OR v.status = :status) AND " +
           "(:startDate IS NULL OR v.checkInTime >= :startDate) AND " +
           "(:endDate IS NULL OR v.checkInTime <= :endDate) AND " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(v.visitor.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " v.visitor.phone LIKE CONCAT('%', :query, '%') OR " +
           " LOWER(v.resident.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(v.resident.apartmentUnit) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(v.passCode) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY v.checkInTime DESC")
    List<Visit> filterVisits(
            @Param("type") VisitorType type,
            @Param("status") VisitStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("query") String query
    );
}
