const Profile = require("../models/profileModel");

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.getProfileByUserId(req.userId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { bio, location, avatar } = req.body;

    // Check if profile exists
    const existingProfile = await Profile.getProfileByUserId(req.userId);

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const newProfile = await Profile.createProfile(
        req.userId,
        bio,
        location,
        avatar
      );
      return res.json(newProfile);
    }

    // Update existing profile
    const updatedProfile = await Profile.updateProfile(
      req.userId,
      bio,
      location,
      avatar
    );

    res.json(updatedProfile);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
