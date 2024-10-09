// lib/db.ts
import mysql from 'mysql2/promise';

// Create a connection pool using the environment variables for credentials
const pool = mysql.createPool({
  host: process.env.DB_HOST,        // Your DB host from environment variables
  user: process.env.DB_USER,        // Your DB username
  password: process.env.DB_PASSWORD,// Your DB password
  database: process.env.DB_NAME,    // Your database name
  waitForConnections: true,
  connectionLimit: 10,              // Limit the number of connections
  queueLimit: 0,
});

export default pool;
