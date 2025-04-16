const express = require("express");
const JobOffer = require("../models/JobSchema"); 
const app = express();
const authenticate = require("../authorizationMiddleware/clientAuth");
// Route to create a new job offer
app.post("/offer", authenticate, async (req, res) => {
  try {
    const { companyName, jobTitle, jobDescription, location, salary, applicationDeadline, skills, Experience } = req.body;

    // Create new job and link user
    const newJob = new JobOffer({ companyName,jobTitle,jobDescription,location,
      salary,applicationDeadline,skills,Experience,clientId: req.user.id, });

    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    console.error("Error in job offer:", err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Route to update a job offer
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { companyName, jobTitle, jobDescription, location, salary, applicationDeadline, skills ,Experience} = req.body;

  try {
    const updatedJobOffer = await JobOffer.findByIdAndUpdate(
      id,
      {companyName,jobTitle,jobDescription,location,salary,
        applicationDeadline,skills,Experience,},{ new: true }
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
app.get("/all", authenticate, async (req, res) => {
  console.log('/api/jobs/all');

  try {
    // Conditionally filter by clientId if the user is a Client
    const filter = req.user.Role === "Client" ? { clientId: req.user.id } : {};

    const jobs = await JobOffer.find(filter);
    res.json({ success: true, jobs });
  } catch (err) {
    console.error("Fetch jobs error:", err.message);
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

// for  dislike 
app.post("/dislike", async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await JobOffer.findByIdAndUpdate(jobId,{ $inc: { dislikes: 1 } }, { new: true } );
    res.json({ success: true, updatedDislikeCount: job.dislikes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error disliking job" });
  }
});
// for undislike
app.post("/undislike", async (req, res) => {
  const { jobId } = req.body;

  try {
    const job = await JobOffer.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    job.dislikes = Math.max(0, job.dislikes - 1);
    await job.save();
    
    res.json({ success: true, updatedDislikeCount: job.dislikes });
  

  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing dislike", error });
  }
});
 // for like
app.post("/like", async (req, res) => {
  try {
    const { jobId } = req.body;
   const jobl= await JobOffer.findByIdAndUpdate(jobId, { $inc: { likes: 1 } },{new:true}); 
    res.json({ success: true, updatedlikeCount: jobl.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error liking job" });
  }
});
 // for unlike
app.post("/unlike", async (req, res) => {
  const { jobId } = req.body;
  try {
    const job = await JobOffer.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    job.likes = Math.max(0, job.likes - 1);
    await job.save();
    
    res.json({ success: true, updatedLikeCount: job.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error unliking job", error });
  }
});


module.exports = app;
