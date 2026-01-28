const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT)
});

async function verifyDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL database!');

    // Check if tables exist
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    const result = await client.query(tablesQuery);

    console.log('\n📊 Tables in database:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    client.release();
    await pool.end();
    console.log('\n✅ Database verification complete!');
  } catch (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
}

verifyDatabase();
