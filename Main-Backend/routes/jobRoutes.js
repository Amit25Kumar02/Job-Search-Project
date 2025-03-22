const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const JobApplication = require("../models/JobApplication");
const JobOffer = require("../models/JobSchema");

const app = express();

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage for Resume Uploads
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.post("/apply", upload.single("resume"), async (req, res) => {
    // console.log("Received Data:", req.body);
    // console.log("Uploaded File:", req.file);

    if (!req.file) {
        return res.status(400).json({ success: false, message: "Resume file is required" });
    }

    const { jobId, userId, userName, userEmail, Phone } = req.body;

    if (!jobId || !userId || !userName || !userEmail || !Phone) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const job = await JobOffer.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const newApplication = new JobApplication({
            jobId,
            userId,
            userName,
            userEmail,
            Phone,
            resume: `${req.protocol}://localhost:5200/uploads/${req.file.filename}`

        });

        await newApplication.save();
        res.status(201).json({ success: true, message: "Application submitted successfully" });

    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

app.get("/applications", async (req, res) => {
    try {
        const applications = await JobApplication.find().populate({
            path: "jobId",
            model: "JobOffer",
            select: "jobTitle companyName _id"
        });
        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch applications", error: error.message });
    }
});


app.get("/applications/:id", async (req, res) => {
    try {
        const application = await JobApplication.findById(req.params.id).populate("jobId", "jobTitle companyName");

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        res.json({ success: true, application });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});


app.delete("/del/:id", async (req, res) => {
    try {
        const deletedApplication = await JobApplication.findByIdAndDelete(req.params.id);
        
        if (!deletedApplication) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = app;
