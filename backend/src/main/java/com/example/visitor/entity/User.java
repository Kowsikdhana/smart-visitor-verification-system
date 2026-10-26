package com.example.visitor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * User Entity represents authorized staff who can log in (Security Guards and Admins).
 *
 * JPA Annotations explained:
 * - @Entity: Marks this class as a persistent Java object mapped to a relational database table.
 * - @Table: Specifies the database table name ("users").
 * - @Id: Denotes the primary key column.
 * - @GeneratedValue: Automatically generates unique ID values using the database's AUTO_INCREMENT strategy.
 * - @Column: Configures column details like uniqueness and nullability.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 30)
    private String role; // e.g., "ROLE_GUARD" or "ROLE_ADMIN"

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public User() {
    }

    public User(String username, String password, String fullName, String role) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
