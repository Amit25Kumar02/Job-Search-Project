const mongoose = require("mongoose");
const JobOffer = require("./JobSchema")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobOffer" }],
  userType: { type: String, enum: ["Client", "User"], default: "User" },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User",userSchema);

module.exports = User;
