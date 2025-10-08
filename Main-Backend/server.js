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
require("dotenv").config();

const app = express();

// -------------------
//  Middleware
// -------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//  Correct CORS configuration
const allowedOrigins = [
  "https://amitjobhub.netlify.app",
  "https://amitjob-admin.netlify.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: false, // no cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// -------------------
//  Static files
// -------------------
app.use("/uploads", express.static("uploads"));
app.use("/profileImage", express.static("uploads"));

// -------------------
//  Connect to DB
// -------------------
connectDB();

// -------------------
//  Routes
// -------------------
app.use("/api/Ajobs", JobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobOfferRoutes);
app.use("/api/Admin", AdminRoutes);
app.use("/api/Favroit", Favroit);
app.use("/api/con", ContactRoutes);

// -------------------
//  Root route
// -------------------
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// -------------------
//  Start Server
// -------------------
const PORT = process.env.PORT || 5200;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
