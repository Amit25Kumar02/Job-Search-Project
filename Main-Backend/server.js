const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./mongoDB");
const userRoutes = require("./routes/userRoutes"); // This is now a proper router
const jobOfferRoutes = require("./routes/Client");
const AdminRoutes = require("./routes/AdminRoutes");
const JobRoutes = require("./routes/jobRoutes");
const Favroit = require("./routes/favroit");
const ContactRoutes = require("./routes/contactUsRoutes");
require("dotenv").config();

const app = express();

// -------------------
//  Enhanced CORS Configuration
// -------------------
const allowedOrigins = [
  "https://amitjobhub.netlify.app",
  "https://amitjob-admin.netlify.app",
  "http://localhost:5173",
  "https://job-search-project-330t.onrender.com" // Added your render URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Handle preflight requests
app.options("*", cors());

// -------------------
//  Middleware
// -------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// -------------------
//  Static files
// -------------------
app.use("/uploads", express.static("uploads"));
app.use("/profileImage", express.static("uploads"));

// -------------------
//  Connect to DB
// -------------------
connectDB();

// -------------------
//  Health Check Route
// -------------------
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// -------------------
//  Routes
// -------------------
app.use("/api/Ajobs", JobRoutes);
app.use("/api/users", userRoutes); // ⬅️ This line mounts the router correctly
app.use("/api/jobs", jobOfferRoutes);
app.use("/api/Admin", AdminRoutes);
app.use("/api/Favroit", Favroit);
app.use("/api/con", ContactRoutes);

// -------------------
//  Root route
// -------------------
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Job Search API is running...",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      users: "/api/users",
      jobs: "/api/jobs",
      admin: "/api/Admin"
    }
  });
});

// -------------------
//  Enhanced Error Handling Middleware
// -------------------
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS policy blocked this request",
      requestedOrigin: req.headers.origin,
      allowedOrigins: allowedOrigins
    });
  }
  
  console.error("Server Error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong!" : err.message
  });
});

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.originalUrl,
    method: req.method 
  });
});

// -------------------
//  Start Server
// -------------------
const PORT = process.env.PORT || 5200;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
});