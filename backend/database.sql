-- Animal Management System Database Schema
-- MySQL Database Schema
-- Created for Animal Management System (Cows and Goats)

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores user accounts and authentication information
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email_verified TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ANIMALS TABLE
-- ============================================
-- Stores animal records (cows and goats)
CREATE TABLE IF NOT EXISTS animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK(type IN ('cow', 'goat')),
    age DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK(status IN ('active', 'sold', 'dead', 'other')),
    gender VARCHAR(10) NOT NULL CHECK(gender IN ('male', 'female')),
    image TEXT,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================
-- INDEXES
-- ============================================
-- Index on user email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on animal number for faster searches
CREATE INDEX IF NOT EXISTS idx_animals_number ON animals(number);

-- Index on animal type for filtering
CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);

-- Index on animal status for filtering
CREATE INDEX IF NOT EXISTS idx_animals_status ON animals(status);

-- Index on user_id for faster user-animal queries
CREATE INDEX IF NOT EXISTS idx_animals_user_id ON animals(user_id);

-- ============================================
-- SAMPLE DATA (Optional - Commented out)
-- ============================================
-- Uncomment below to insert sample data for testing

/*
-- Sample User (password: 'password123' - hashed with bcrypt)
-- Note: In production, use proper password hashing
INSERT INTO users (email, password, name, email_verified) 
VALUES ('admin@example.com', '$2a$10$example_hashed_password', 'Admin User', 1);

-- Sample Animals
INSERT INTO animals (number, type, age, status, user_id) 
VALUES 
    ('COW001', 'cow', '2020-01-15', 'active', 1),
    ('GOAT001', 'goat', '2021-03-20', 'active', 1),
    ('COW002', 'cow', '2019-06-10', 'sold', 1);
*/

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Get all animals with user information
-- SELECT a.*, u.name as owner_name, u.email as owner_email 
-- FROM animals a 
-- JOIN users u ON a.user_id = u.id 
-- ORDER BY a.created_at DESC;

-- Get animals by type
-- SELECT * FROM animals WHERE type = 'cow';
-- SELECT * FROM animals WHERE type = 'goat';

-- Get animals by status
-- SELECT * FROM animals WHERE status = 'active';
-- SELECT * FROM animals WHERE status = 'sold';
-- SELECT * FROM animals WHERE status = 'dead';

-- Get statistics
-- SELECT 
--     COUNT(*) as total_animals,
--     SUM(CASE WHEN type = 'cow' THEN 1 ELSE 0 END) as total_cows,
--     SUM(CASE WHEN type = 'goat' THEN 1 ELSE 0 END) as total_goats,
--     SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_animals,
--     SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_animals,
--     SUM(CASE WHEN status = 'dead' THEN 1 ELSE 0 END) as dead_animals
-- FROM animals;

-- Get unverified users
-- SELECT * FROM users WHERE email_verified = 0;

-- ============================================
-- NOTES
-- ============================================
-- 1. This schema is designed for SQLite
-- 2. For PostgreSQL/MySQL, you may need to adjust:
--    - AUTOINCREMENT -> AUTO_INCREMENT (MySQL) or SERIAL (PostgreSQL)
--    - DATETIME -> TIMESTAMP
--    - TEXT -> VARCHAR(255) or TEXT depending on needs
-- 3. Password field stores bcrypt hashed passwords
-- 4. Image field stores relative path to uploaded image file
-- 5. Email verification uses a token-based system
-- 6. All timestamps are in UTC by default

