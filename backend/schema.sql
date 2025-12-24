-- ============================================
-- ANIMAL MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================
-- Version: 1.0
-- Database: SQLite
-- Description: Schema for Animal Management System
--              Supports Cows and Goats management

-- ============================================
-- DROP TABLES (Use with caution - deletes all data)
-- ============================================
-- DROP TABLE IF EXISTS animals;
-- DROP TABLE IF EXISTS users;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    email_verified INTEGER DEFAULT 0,
    verification_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ANIMALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS animals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('cow', 'goat')),
    age DATE NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('active', 'sold', 'dead', 'other')),
    gender TEXT NOT NULL CHECK(gender IN ('male', 'female')) DEFAULT 'male',
    image TEXT,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_animals_number ON animals(number);
CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);
CREATE INDEX IF NOT EXISTS idx_animals_status ON animals(status);
CREATE INDEX IF NOT EXISTS idx_animals_user_id ON animals(user_id);
CREATE INDEX IF NOT EXISTS idx_animals_created_at ON animals(created_at);

-- ============================================
-- END OF SCHEMA
-- ============================================

