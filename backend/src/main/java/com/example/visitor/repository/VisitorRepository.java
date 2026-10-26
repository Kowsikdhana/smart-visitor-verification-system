package com.example.visitor.repository;

import com.example.visitor.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * VisitorRepository handles database lookups for visitor profiles.
 *
 * Fast verification workflow:
 * When a visitor arrives, security enters the phone number.
 * findByPhone() checks the database instantly to see if this visitor is already known.
 */
@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    Optional<Visitor> findByPhone(String phone);

    boolean existsByPhone(String phone);

    List<Visitor> findByFullNameContainingIgnoreCaseOrCompanyContainingIgnoreCase(String name, String company);
}
