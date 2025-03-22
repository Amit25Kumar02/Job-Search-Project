const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username:{type:String,required:true},
  email:{type:String , required:true  },
  password:{type:String,required:true},
  isVerified: { type: Boolean, default: false }, // Email verification status
  // otp: [{type:String} , { expiryTime : {type : Date}}],
  otp: String, // Temporary OTP storage
  otpExpiry: Date, // OTP expiration
  CreatedAt:{type:Date,default:Date.now} 
})
const Admin = mongoose.model("adminn",AdminSchema);

module.exports = Admin




