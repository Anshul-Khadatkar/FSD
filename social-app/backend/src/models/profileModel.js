const db = require("../config/db");

class Profile {
  static async createProfile(userId, bio = "", location = "", avatar = "") {
    try {
      const result = await db.query(
        "INSERT INTO profiles (user_id, bio, location, avatar) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId, bio, location, avatar]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  }

  static async getProfileByUserId(userId) {
    try {
      const result = await db.query(
        `SELECT p.*, u.name, u.email 
         FROM profiles p 
         JOIN users u ON p.user_id = u.id 
         WHERE p.user_id = $1`,
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error getting profile by user id:", error);
      throw error;
    }
  }

  static async updateProfile(userId, bio, location, avatar) {
    try {
      const result = await db.query(
        "UPDATE profiles SET bio = $1, location = $2, avatar = $3, updated_at = NOW() WHERE user_id = $4 RETURNING *",
        [bio, location, avatar, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
}

module.exports = Profile;
