const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all profile routes
router.use(authMiddleware);

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", profileController.getProfile);

// @route   PUT /api/profile
// @desc    Update or create user profile
// @access  Private
router.put("/", profileController.updateProfile);

module.exports = router;
