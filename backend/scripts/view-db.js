const mysql = require('mysql2/promise');

const {
  DB_HOST = 'localhost',
  DB_PORT = 3306,
  DB_USER,
  DB_PASS,
  DB_NAME = 'animal_management',
} = process.env;

async function main() {
  console.log('='.repeat(60));
  console.log('DATABASE CONTENTS (MySQL)');
  console.log('='.repeat(60));
  console.log(`Database: ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  console.log('');

  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });

    // Users
    const [users] = await conn.query('SELECT id, name, email, email_verified, created_at FROM users');
    console.log('USERS TABLE:');
    console.log('-'.repeat(60));
    if (users.length === 0) {
      console.log('  (No users found)');
    } else {
      users.forEach((row, index) => {
        console.log(`\n  User ${index + 1}:`);
        console.log(`    ID: ${row.id}`);
        console.log(`    Name: ${row.name}`);
        console.log(`    Email: ${row.email}`);
        console.log(`    Email Verified: ${row.email_verified ? 'Yes' : 'No'}`);
        console.log(`    Created: ${row.created_at}`);
      });
    }
    console.log('');

    // Animals
    const [animals] = await conn.query('SELECT * FROM animals ORDER BY created_at DESC');
    console.log('ANIMALS TABLE:');
    console.log('-'.repeat(60));
    if (animals.length === 0) {
      console.log('  (No animals found)');
    } else {
      animals.forEach((row, index) => {
        console.log(`\n  Animal ${index + 1}:`);
        console.log(`    ID: ${row.id}`);
        console.log(`    Number: ${row.number}`);
        console.log(`    Type: ${row.type}`);
        console.log(`    Age: ${row.age}`);
        console.log(`    Status: ${row.status}`);
        console.log(`    Image: ${row.image || 'None'}`);
        console.log(`    User ID: ${row.user_id}`);
        console.log(`    Created: ${row.created_at}`);
        console.log(`    Updated: ${row.updated_at}`);
      });
    }
    console.log('');

    // Stats
    const [[{ total_animals }]] = await conn.query('SELECT COUNT(*) AS total_animals FROM animals');
    const [[{ total_users }]] = await conn.query('SELECT COUNT(*) AS total_users FROM users');
    console.log('STATISTICS:');
    console.log('-'.repeat(60));
    console.log(`  Total Users: ${total_users}`);
    console.log(`  Total Animals: ${total_animals}`);
    console.log('='.repeat(60));

    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Error reading database:', err.message);
    process.exit(1);
  }
}

main();

