const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobOffer", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  Phone: { type: String, required: true },
  resume: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now }
});

const JobApplication =  mongoose.model("ApplyJobApplication", JobApplicationSchema);
module.exports = JobApplication;
