const mongoose = require("mongoose");
const User = require("./userSchema")

const JobOfferSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  jobDescription: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  skills: { type: [String], required: true },
  clientId:{type :mongoose.Schema.Types.ObjectId , ref: 'User'},
  applicationDeadline: { type: Date, required: true },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("JobOffer", JobOfferSchema);
