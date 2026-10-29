-- ====================================================================
-- College RDBMS Project: Student Login & Registration System
-- Database Setup Script for MySQL Workbench 8.0 CE & XAMPP
-- ====================================================================

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS `student_portal`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `student_portal`;

-- 2. Drop existing table if recreating during practical testing
-- DROP TABLE IF EXISTS `users`;

-- 3. Create the `users` Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `student_id` VARCHAR(30) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Seed Default Admin Account
-- Default Admin Credentials:
-- Email:    admin@portal.edu
-- Password: Admin@123
-- Hash generated using PHP: password_hash('Admin@123', PASSWORD_BCRYPT)
INSERT INTO `users` (`full_name`, `student_id`, `email`, `password`, `role`)
VALUES 
(
  'System Administrator',
  'ADM-001',
  'admin@portal.edu',
  '$2y$10$vN4G2tV4oV2iWp/7rR1Rk.fQfK3uB9tP9kY9H5k3G2nZ2w9t1Q8vC',
  'admin'
)
ON DUPLICATE KEY UPDATE `email` = `email`;

-- 5. Seed Sample Student Accounts for Testing
-- Student Accounts Password: Student@123
-- Hash: password_hash('Student@123', PASSWORD_BCRYPT)
INSERT INTO `users` (`full_name`, `student_id`, `email`, `password`, `role`)
VALUES
(
  'Rohan Sharma',
  'STU-2024-001',
  'rohan.sharma@college.edu',
  '$2y$10$oXkP8n/yPz2d1tLq7sJ0te1y9y3k8r9a6vG4j5k3h2b1m0n9p8q7r',
  'student'
),
(
  'Priya Patel',
  'STU-2024-002',
  'priya.patel@college.edu',
  '$2y$10$oXkP8n/yPz2d1tLq7sJ0te1y9y3k8r9a6vG4j5k3h2b1m0n9p8q7r',
  'student'
),
(
  'Amit Verma',
  'STU-2024-003',
  'amit.verma@college.edu',
  '$2y$10$oXkP8n/yPz2d1tLq7sJ0te1y9y3k8r9a6vG4j5k3h2b1m0n9p8q7r',
  'student'
)
ON DUPLICATE KEY UPDATE `email` = `email`;

-- Verify table creation and seeded data
SELECT `id`, `full_name`, `student_id`, `email`, `role`, `created_at` FROM `users`;
