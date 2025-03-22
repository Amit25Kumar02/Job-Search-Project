const express = require("express");
const JobOffer = require("../models/JobSchema"); 
const app = express();

// Route to create a new job offer
app.post("/offer", async (req, res) => {
  try {
    const { companyName, jobTitle, jobDescription, location, salary, applicationDeadline, skills } = req.body;

    if (!companyName || !jobTitle || !jobDescription || !location || !salary || !applicationDeadline || !skills) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const newJob = new JobOffer({ companyName, jobTitle, jobDescription, location, salary, applicationDeadline, skills});

    await newJob.save();
    res.json({ success: true, message: "Job offer created successfully!", job: newJob });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


// Route to update a job offer
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { companyName, jobTitle, jobDescription, location, salary, applicationDeadline, skills } = req.body;

  try {
    const updatedJobOffer = await JobOffer.findByIdAndUpdate(
      id,
      {
        companyName,
        jobTitle,
        jobDescription,
        location,
        salary,
        applicationDeadline,
        skills,
      },
      { new: true }
    );

    if (!updatedJobOffer) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    res.json({ success: true, job: updatedJobOffer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route to delete a job offer
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJobOffer = await JobOffer.findByIdAndDelete(id);

    if (!deletedJobOffer) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    res.json({ success: true, message: "Job deleted successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route to fetch all job offers
app.get("/all", async (req, res) => {
  try {
    const jobs = await JobOffer.find();
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.get("/det/:id", async (req, res) => {
  try {
    const job = await JobOffer.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
module.exports = app;
