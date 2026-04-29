/**
 * Database connection pool using mysql2/promise.
 * Reads credentials from environment variables (set via Docker or .env).
 */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306', 10),
  database: process.env.DB_NAME     || 'pnw_events',
  user:     process.env.DB_USER     || 'pnwuser',
  password: process.env.DB_PASSWORD || 'pnwpass',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅  MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌  MySQL connection failed:', err.message);
    // Don't crash — let retry logic handle it in Docker
  }
})();

module.exports = pool;
