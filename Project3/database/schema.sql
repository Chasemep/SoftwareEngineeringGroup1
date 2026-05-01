-- ============================================================
-- PNW Student Life Event Management System
-- Database Schema
-- MySQL 8.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS pnw_events
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pnw_events;

-- ─── Events ──────────────────────────────────────────────────────────────────
-- Stores all PNW student-life events.
CREATE TABLE IF NOT EXISTS events (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)   NOT NULL,
  description TEXT,
  event_date  DATETIME       NOT NULL,
  cost        DECIMAL(8,2)   NOT NULL DEFAULT 0.00,
  location    VARCHAR(255)   NOT NULL,
  latitude    DECIMAL(10,7),               -- for map pin
  longitude   DECIMAL(10,7),              -- for map pin
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_event_date (event_date),
  FULLTEXT INDEX ft_event_search (name, description, location)
) ENGINE=InnoDB;

-- ─── Students ─────────────────────────────────────────────────────────────────
-- One row per unique student (keyed by their PNW student ID string).
CREATE TABLE IF NOT EXISTS students (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(100)  NOT NULL,
  middle_name VARCHAR(100),
  last_name   VARCHAR(100)  NOT NULL,
  student_id  VARCHAR(20)   NOT NULL UNIQUE,   -- e.g. "0012345678"
  email       VARCHAR(255),
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_student_id (student_id)
) ENGINE=InnoDB;

-- ─── Registrations ────────────────────────────────────────────────────────────
-- Junction table — a student may register for many events.
CREATE TABLE IF NOT EXISTS registrations (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id    INT UNSIGNED NOT NULL,
  event_id      INT UNSIGNED NOT NULL,
  registered_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_reg_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_event   FOREIGN KEY (event_id)   REFERENCES events(id)   ON DELETE CASCADE,
  UNIQUE KEY uq_student_event (student_id, event_id),
  INDEX idx_reg_event_id (event_id)
) ENGINE=InnoDB;

-- ─── Parking Lots ─────────────────────────────────────────────────────────────
-- Parking options associated with events (or campus-wide when event_id IS NULL).
CREATE TABLE IF NOT EXISTS parking_lots (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  location      VARCHAR(255) NOT NULL,
  event_id      INT UNSIGNED,                  -- NULL = campus-wide general lot
  distance_ft   INT UNSIGNED NOT NULL DEFAULT 0,
  walk_time_min TINYINT UNSIGNED NOT NULL DEFAULT 0,
  latitude      DECIMAL(10,7),
  longitude     DECIMAL(10,7),
  notes         TEXT,

  CONSTRAINT fk_parking_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  INDEX idx_parking_event_id (event_id)
) ENGINE=InnoDB;
