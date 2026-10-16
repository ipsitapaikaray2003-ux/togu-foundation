import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Detect SSL requirement (Aiven, TiDB, or explicit DB_SSL=true)
const shouldUseSSL = 
  process.env.DB_SSL === 'true' || 
  (process.env.DB_HOST && (process.env.DB_HOST.includes('aivencloud.com') || process.env.DB_HOST.includes('tidbcloud.com'))) ||
  (process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('sslmode=') || process.env.DATABASE_URL.includes('aiven') || process.env.DATABASE_URL.includes('tidb')));

const poolConfig = process.env.DATABASE_URL
  ? {
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      timezone: '+05:30',
      dateStrings: true,
      ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined
    }
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'togu_foundation',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      timezone: '+05:30',
      dateStrings: true,
      ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined
    };

const pool = mysql.createPool(poolConfig);

// Health check on startup (non-fatal)
(async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 as is_alive');
    console.log(`✅ [Database] Connected successfully to MySQL (${process.env.DB_NAME || 'togu_foundation'}) [SSL: ${shouldUseSSL ? 'Enabled' : 'Disabled'}]`);
    connection.release();
  } catch (err) {
    console.error('⚠️ [Database] Connection warning:', err.message);
    console.error('👉 Tip: Check your DB_HOST, DB_USER, DB_PASSWORD and DB_NAME in environment variables.');
  }
})();

export default pool;
