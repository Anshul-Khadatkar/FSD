const express = require("express");
const cors = require("cors");
const { initializeDB } = require("./utils/dbInit");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Initialize app
const app = express();

// Initialize database
initializeDB();

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:4200", "http://localhost:60114"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Base route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Registration API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
