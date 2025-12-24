const mysql = require('mysql2/promise');

const {
  DB_HOST = 'localhost',
  DB_PORT = 3306,
  DB_USER,
  DB_PASS,
  DB_NAME = 'animal_management',
} = process.env;

async function main() {
  console.log('Checking MySQL database...');
  console.log(`Host: ${DB_HOST}:${DB_PORT}`);
  console.log(`Database: ${DB_NAME}`);

  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });

    console.log('✓ Connection successful');

    const [tables] = await conn.query('SHOW TABLES');
    console.log(`✓ Tables found: ${tables.length}`);
    tables.forEach((row) => {
      const name = Object.values(row)[0];
      console.log(`  - ${name}`);
    });

    await conn.end();
    console.log('✓ Database check complete');
  } catch (err) {
    console.error('✗ Database check failed:', err.message);
    process.exit(1);
  }
}

main();

