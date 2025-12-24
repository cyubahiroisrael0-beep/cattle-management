const mysql = require('mysql2/promise');

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER,
  DB_PASS,
  DB_NAME = 'cattle_management',
} = process.env;

if (!DB_USER || !DB_PASS) {
  console.warn('Warning: DB_USER or DB_PASS not set. Check your .env configuration.');
}

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initializeDatabase() {
  const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name VARCHAR(255) NOT NULL,
      email_verified TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createAnimals = `
    CREATE TABLE IF NOT EXISTS animals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      number VARCHAR(255) UNIQUE NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN ('cow','goat')),
      age DATE NOT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('active','sold','dead','other')),
      image TEXT,
      user_id INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
    'CREATE INDEX IF NOT EXISTS idx_animals_number ON animals(number);',
    'CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);',
    'CREATE INDEX IF NOT EXISTS idx_animals_status ON animals(status);',
    'CREATE INDEX IF NOT EXISTS idx_animals_user_id ON animals(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_animals_created_at ON animals(created_at);',
  ];

  const conn = await pool.getConnection();
  try {
    await conn.query(createUsers);
    await conn.query(createAnimals);
    for (const idx of createIndexes) {
      await conn.query(idx);
    }
    console.log('MySQL database initialized');
  } finally {
    conn.release();
  }
}

async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

initializeDatabase().catch((err) => {
  console.error('Database initialization error:', err);
});

module.exports = { pool, query };

