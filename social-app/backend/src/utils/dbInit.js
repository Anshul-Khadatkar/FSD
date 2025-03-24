const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initializeDB = async () => {
  console.log("Attempting to initialize database...");
  const client = await pool.connect();

  try {
    // Create schema if it doesn't exist and ensure correct permissions
    try {
      await client.query(`
        CREATE SCHEMA IF NOT EXISTS public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;
      `);
      console.log("Schema permissions set successfully");
    } catch (error) {
      console.error("Error setting schema permissions:", error.message);
      // Continue anyway, as we might still be able to create tables
    }

    // Create users table with additional error handling
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Users table checked/created successfully");
    } catch (error) {
      console.error("Error creating users table:", error.message);
      throw error;
    }

    // Create profiles table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS profiles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          bio TEXT DEFAULT '',
          location VARCHAR(100) DEFAULT '',
          avatar VARCHAR(255) DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Profiles table checked/created successfully");
    } catch (error) {
      console.error("Error creating profiles table:", error.message);
      throw error;
    }

    // Create posts table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Posts table checked/created successfully");
    } catch (error) {
      console.error("Error creating posts table:", error.message);
      throw error;
    }

    // Create comments table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS comments (
          id SERIAL PRIMARY KEY,
          post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Comments table checked/created successfully");
    } catch (error) {
      console.error("Error creating comments table:", error.message);
      throw error;
    }

    // Create likes table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS likes (
          id SERIAL PRIMARY KEY,
          post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(post_id, user_id)
        )
      `);
      console.log("Likes table checked/created successfully");
    } catch (error) {
      console.error("Error creating likes table:", error.message);
      throw error;
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  initializeDB,
  pool, // Export the pool for use in other files
};
