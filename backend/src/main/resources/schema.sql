-- ========================================================
-- Smart Visitor Verification System - Database Schema (MySQL)
-- ========================================================

CREATE DATABASE IF NOT EXISTS smart_visitor_db;
USE smart_visitor_db;

-- 1. Users Table (Security Guards & Admins)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_GUARD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Residents / Employees Table
CREATE TABLE IF NOT EXISTS residents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    apartment_unit VARCHAR(50) NOT NULL,
    building_block VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_resident_search (name, apartment_unit)
);

-- 3. Visitors Table (Represents identity / person)
CREATE TABLE IF NOT EXISTS visitors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    company VARCHAR(100),
    vehicle_number VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_visitor_phone (phone)
);

-- 4. Visits Table (Represents a specific check-in session)
CREATE TABLE IF NOT EXISTS visits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pass_code VARCHAR(30) NOT NULL UNIQUE,
    visitor_id BIGINT NOT NULL,
    resident_id BIGINT NOT NULL,
    visitor_type VARCHAR(30) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'CHECKED_IN',
    check_in_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_visit_visitor FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,
    CONSTRAINT fk_visit_resident FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE,
    INDEX idx_visit_status (status),
    INDEX idx_visit_check_in (check_in_time)
);
