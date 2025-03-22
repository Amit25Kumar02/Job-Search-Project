const mongoose = require("mongoose");

const JobOfferSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  jobDescription: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  skills: { type: [String], required: true },
  applicationDeadline: { type: Date, required: true },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("JobOffer", JobOfferSchema);
