const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./mongoDB");
const userRoutes = require("./routes/userRoutes");
const jobOfferRoutes = require("./routes/Client");
const AdminRoutes = require("./routes/AdminRoutes");
const JobRoutes = require("./routes/jobRoutes");
const Favroit = require("./routes/favroit");
const ContactRoutes = require("./routes/contactUsRoutes");
const path = require("path");
require("dotenv").config();

const app = express();

// --------------------
// 🧩 Middleware
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Allowed frontend origins
const allowedOrigins = [
  "https://amitjobhub.netlify.app",
  "https://amitjob-admin.netlify.app",
  "http://localhost:3000" // for local development
];

// ✅ Proper CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight OPTIONS requests globally
app.options("*", cors());

// --------------------
// 🗂 Static file serving
// --------------------
app.use("/uploads", express.static("uploads"));
app.use("/profileImage", express.static("uploads"));

// --------------------
// 🔌 Connect Database
// --------------------
connectDB();

// --------------------
// 🛠 Routes
// --------------------
app.use("/api/Ajobs", JobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobOfferRoutes);
app.use("/api/Admin", AdminRoutes);
app.use("/api/Favroit", Favroit);
app.use("/api/con", ContactRoutes);

// --------------------
// 🧭 Root route
// --------------------
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// --------------------
// 🚀 Start Server
// --------------------
const PORT = process.env.PORT || 5200;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
