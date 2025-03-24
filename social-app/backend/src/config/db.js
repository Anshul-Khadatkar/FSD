const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection
pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Database connection error:", err.stack));

module.exports = {
  query: (text, params) => pool.query(text, params),
};
