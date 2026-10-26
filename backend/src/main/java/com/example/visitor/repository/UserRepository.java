package com.example.visitor.repository;

import com.example.visitor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository provides Spring Data JPA database operations for the User entity.
 *
 * Concepts explained:
 * - JpaRepository<User, Long>: By extending JpaRepository, Spring automatically generates
 *   methods like save(), findById(), findAll(), deleteById(), without writing a single line of SQL!
 * - Derived Query Methods: Methods like findByUsername are translated by Spring Data JPA
 *   into: "SELECT * FROM users WHERE username = ?"
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}
