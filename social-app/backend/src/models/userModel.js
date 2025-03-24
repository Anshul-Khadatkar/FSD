const db = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  static async createUser(name, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
        [name, email, hashedPassword]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async findUserByEmail(email) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  static async findUserById(id) {
    try {
      const result = await db.query(
        "SELECT id, name, email, created_at FROM users WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw error;
    }
  }
}

module.exports = User;
