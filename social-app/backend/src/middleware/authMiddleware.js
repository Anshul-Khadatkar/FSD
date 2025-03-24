const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.header("Authorization");

  // Check if no token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user id to request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
