-- ==========================================================
-- TOGU FOUNDATION — COMPLETE MYSQL DATABASE SCHEMA
-- Compatible with MySQL 8.0, MariaDB 10.4+, MySQL Workbench
-- ==========================================================

-- NOTE: If using MySQL Workbench locally and creating a new DB:
-- CREATE DATABASE IF NOT EXISTS `togu_foundation` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `togu_foundation`;
-- If importing via Hostinger phpMyAdmin, select your database from the left sidebar first.

-- Disable foreign key checks during initialization
SET FOREIGN_KEY_CHECKS = 0;

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Super Admin', 'Admin', 'Staff') NOT NULL DEFAULT 'Staff',
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `phone` VARCHAR(30) NULL,
  `avatar` VARCHAR(255) NULL,
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_admin_email` (`email`),
  INDEX `idx_admin_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ACTIVITY LOGS TABLE (AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `actor_name` VARCHAR(100) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `record_type` VARCHAR(50) NOT NULL,
  `record_id` VARCHAR(100) NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_log_user` (`user_id`),
  INDEX `idx_log_action` (`action`),
  INDEX `idx_log_record_type` (`record_type`),
  INDEX `idx_log_created_at` (`created_at`),
  CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) 
    REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. VOLUNTEERS TABLE
CREATE TABLE IF NOT EXISTS `volunteers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `volunteer_id` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `address` TEXT NULL,
  `city` VARCHAR(100) NULL,
  `state` VARCHAR(100) NULL,
  `areas_of_interest` VARCHAR(255) NULL,
  `skills` TEXT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected', 'Inactive') NOT NULL DEFAULT 'Pending',
  `admin_notes` TEXT NULL,
  `is_archived` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_vol_status` (`status`),
  INDEX `idx_vol_email` (`email`),
  INDEX `idx_vol_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ENQUIRIES & CONTACTS TABLE
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `enquiry_id` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `subject` VARCHAR(255) NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('New', 'In Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'New',
  `assigned_to` INT NULL,
  `internal_notes` TEXT NULL,
  `is_archived` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_enq_status` (`status`),
  INDEX `idx_enq_created` (`created_at`),
  CONSTRAINT `fk_enquiries_assigned` FOREIGN KEY (`assigned_to`) 
    REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. MEMBERS TABLE
CREATE TABLE IF NOT EXISTS `members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `membership_id` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `address` TEXT NULL,
  `membership_type` VARCHAR(100) NOT NULL DEFAULT 'Regular',
  `joining_date` DATE NOT NULL,
  `status` ENUM('Active', 'Pending', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Active',
  `notes` TEXT NULL,
  `is_archived` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_mem_status` (`status`),
  INDEX `idx_mem_type` (`membership_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PROGRAMS & FOCUS AREAS TABLE
CREATE TABLE IF NOT EXISTS `programs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `category` VARCHAR(100) NOT NULL,
  `short_description` TEXT NULL,
  `full_description` LONGTEXT NULL,
  `cover_image` VARCHAR(255) NULL,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `location` VARCHAR(255) NULL,
  `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Published',
  `featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_prog_status` (`status`),
  INDEX `idx_prog_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. EVENTS & ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `cover_image` VARCHAR(255) NULL,
  `event_date` DATE NOT NULL,
  `start_time` VARCHAR(20) NULL,
  `end_time` VARCHAR(20) NULL,
  `location` VARCHAR(255) NULL,
  `program_id` INT NULL,
  `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Published',
  `is_archived` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_event_date` (`event_date`),
  INDEX `idx_event_status` (`status`),
  CONSTRAINT `fk_event_program` FOREIGN KEY (`program_id`) 
    REFERENCES `programs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS `donations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `donation_id` VARCHAR(50) NOT NULL UNIQUE,
  `donor_name` VARCHAR(150) NOT NULL,
  `donor_email` VARCHAR(150) NULL,
  `donor_phone` VARCHAR(30) NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `donation_date` DATE NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer',
  `transaction_id` VARCHAR(100) NULL,
  `payment_status` ENUM('Pending', 'Successful', 'Failed', 'Refunded') NOT NULL DEFAULT 'Pending',
  `program_id` INT NULL,
  `receipt_number` VARCHAR(50) NULL,
  `internal_notes` TEXT NULL,
  `created_by` INT NULL,
  `is_archived` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_don_status` (`payment_status`),
  INDEX `idx_don_date` (`donation_date`),
  CONSTRAINT `fk_donation_program` FOREIGN KEY (`program_id`) 
    REFERENCES `programs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_donation_creator` FOREIGN KEY (`created_by`) 
    REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `expense_id` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `expense_date` DATE NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer',
  `vendor_recipient` VARCHAR(150) NOT NULL,
  `program_id` INT NULL,
  `description` TEXT NULL,
  `receipt_file` VARCHAR(255) NULL,
  `created_by` INT NULL,
  `is_archived` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_exp_date` (`expense_date`),
  INDEX `idx_exp_cat` (`category`),
  CONSTRAINT `fk_expense_program` FOREIGN KEY (`program_id`) 
    REFERENCES `programs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_expense_creator` FOREIGN KEY (`created_by`) 
    REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. WEBSITE CONTENT TABLE
CREATE TABLE IF NOT EXISTS `website_content` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `section_key` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(255) NULL,
  `content` JSON NOT NULL,
  `updated_by` INT NULL,
  `status` ENUM('Draft', 'Published') NOT NULL DEFAULT 'Published',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_content_key` (`section_key`),
  CONSTRAINT `fk_content_editor` FOREIGN KEY (`updated_by`) 
    REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. GALLERY TABLE
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `caption` TEXT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'General',
  `image_url` VARCHAR(255) NOT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_gal_category` (`category`),
  INDEX `idx_gal_pub` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `designation` VARCHAR(150) NOT NULL,
  `role_type` ENUM('Founder', 'Trustee', 'Executive', 'Advisory') NOT NULL DEFAULT 'Executive',
  `photo` VARCHAR(255) NULL,
  `bio` TEXT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_team_pub` (`is_published`),
  INDEX `idx_team_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
