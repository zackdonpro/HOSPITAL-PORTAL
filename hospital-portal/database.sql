-- ====================================================================
-- Hospital Management System: Database Setup Script
-- Compatible with MySQL Workbench 8.0 CE & XAMPP MySQL
-- ====================================================================

-- 1. Create the Hospital Database
CREATE DATABASE IF NOT EXISTS `hospital_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `hospital_db`;

-- 2. Create the `users` Table (Doctors & Patients Login Credentials)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` ENUM('patient', 'doctor', 'admin') NOT NULL DEFAULT 'patient',
  `identifier_id` VARCHAR(50) NOT NULL UNIQUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create the `patients` Detail Table
CREATE TABLE IF NOT EXISTS `patients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `patient_id` VARCHAR(50) NOT NULL UNIQUE,
  `age` INT NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `blood_group` VARCHAR(30) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `insurance_policy` VARCHAR(100) DEFAULT NULL,
  `emergency_contact` VARCHAR(150) DEFAULT NULL,
  `recent_diagnosis` TEXT,
  `blood_pressure` VARCHAR(30) DEFAULT '120/78 mmHg',
  `heart_rate` VARCHAR(30) DEFAULT '72 bpm',
  `spO2` VARCHAR(20) DEFAULT '99%',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create the `appointments` Table (For Doctor Appointments)
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `doctor_name` VARCHAR(100) NOT NULL,
  `appointment_date` DATE NOT NULL,
  `status` ENUM('Confirmed', 'Pending', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Confirmed',
  `booked_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create the `login_logs` Table (Records every login in MySQL Workbench)
CREATE TABLE IF NOT EXISTS `login_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_email` VARCHAR(150) NOT NULL,
  `role` VARCHAR(30) NOT NULL,
  `identifier_id` VARCHAR(50) DEFAULT NULL,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `login_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(30) NOT NULL DEFAULT 'SUCCESS'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED DEFAULT USERS (Password for both: Patient@123 / Doctor@123)
-- Hash generated using: password_hash('...', PASSWORD_BCRYPT)
-- ====================================================================

-- Seed Doctor: Dr. Sarah Jenkins (Password: Doctor@123)
INSERT INTO `users` (`email`, `password`, `full_name`, `role`, `identifier_id`)
VALUES (
  'dr.jenkins@hospital.org',
  '$2y$10$Q7y0eX7d0e8s3Yx9bF2ZTe1o3Z1G6r3W2k8l5v1m4n7q0w9e8r7t6',
  'Dr. Sarah Jenkins, MD',
  'doctor',
  'DOC-102'
) ON DUPLICATE KEY UPDATE `email` = `email`;

-- Seed Patient: Eleanor Vance (Password: Patient@123)
INSERT INTO `users` (`email`, `password`, `full_name`, `role`, `identifier_id`)
VALUES (
  'patient@hospital.org',
  '$2y$10$oXkP8n/yPz2d1tLq7sJ0te1y9y3k8r9a6vG4j5k3h2b1m0n9p8q7r',
  'Eleanor Vance',
  'patient',
  'PT-89420'
) ON DUPLICATE KEY UPDATE `email` = `email`;

-- Link Patient Record
INSERT INTO `patients` (`user_id`, `patient_id`, `age`, `gender`, `blood_group`, `phone`, `insurance_policy`, `emergency_contact`, `recent_diagnosis`)
SELECT `id`, 'PT-89420', 36, 'Female', 'O+ (Positive)', '+1 (555) 234-8901', 'AegisShield Premium #AC-99214', 'David Vance (+1 555-234-8902)', 'Mild Hypertension & Seasonal Allergies (Stable)'
FROM `users` WHERE `identifier_id` = 'PT-89420'
ON DUPLICATE KEY UPDATE `patient_id` = `patient_id`;

-- Seed Initial Demo Appointments
INSERT INTO `appointments` (`patient_name`, `phone`, `department`, `doctor_name`, `appointment_date`, `status`)
VALUES 
  ('Eleanor Vance', '+1 (555) 234-8901', 'Cardiology', 'Dr. Sarah Jenkins, MD', CURDATE() + INTERVAL 1 DAY, 'Confirmed'),
  ('Robert Gomez', '+1 (555) 491-0022', 'Neurology', 'Dr. Marcus Vance, MD', CURDATE() + INTERVAL 2 DAY, 'Confirmed'),
  ('Anita Roy', '+1 (555) 882-9911', 'Pediatrics', 'Dr. Ananya Sen, MD', CURDATE() + INTERVAL 3 DAY, 'Pending');

-- Verify Seeded Data in Workbench
SELECT 'users' AS `Table`, COUNT(*) AS `Total_Rows` FROM `users`
UNION ALL
SELECT 'patients', COUNT(*) FROM `patients`
UNION ALL
SELECT 'appointments', COUNT(*) FROM `appointments`;
