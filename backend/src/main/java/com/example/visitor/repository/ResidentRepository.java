package com.example.visitor.repository;

import com.example.visitor.entity.Resident;
import com.example.visitor.entity.ResidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ResidentRepository provides database queries for finding and searching residents/employees.
 */
@Repository
public interface ResidentRepository extends JpaRepository<Resident, Long> {

    List<Resident> findByStatus(ResidentStatus status);

    /**
     * Case-insensitive search across name, apartmentUnit, buildingBlock, or phone number.
     * Uses JPQL (Java Persistence Query Language).
     */
    @Query("SELECT r FROM Resident r WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.apartmentUnit) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.buildingBlock) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "r.phone LIKE CONCAT('%', :query, '%')")
    List<Resident> searchResidents(@Param("query") String query);
}
