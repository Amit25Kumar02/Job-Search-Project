const mongoose = require("mongoose");
const JobOffer = require("./JobSchema")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String,},
  password: { type: String, required: true },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobOffer" }],
  userType: { type: String, enum: ["Client", "User"], default: "User" },
  dob:{type:Date},
  address:{type:String},
  profileImage:{type:String},
  overview:{type:String},
  title:{type:String},
  rate:{type:Number},
  project:{type:String},
  skills:{type:String},
  languages:{type:String},
  education:{type:[String]},
  gender:{type:String ,enum:["Male","Female","Other"]},
  // createdAt: { type: Date, default: Date.now }
},
{timestamps:true},
);

const User = mongoose.model("User",userSchema);

module.exports = User;
