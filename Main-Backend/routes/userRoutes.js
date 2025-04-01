const express = require("express");
const User = require("../models/userSchema");
const JTW = require('jsonwebtoken')
const app = express();
const dotenv = require ("dotenv");
const multer = require('multer');
const cors = require('cors');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Otp = require('../models/userOtpSchema');
// const fs = require('fs');
const path = require('path');
dotenv.config();
app.use(express.json()); 
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profileImage/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Function to generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// for signup by user and client
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  let user = await User.findOne({ email })
// console.log( "user",user)
  if (user) {
    res.status(409).send({ message: 'user already exists ..' })
    return
  }
  const otp = generateOTP()
  // Save OTP in MongoDB (Overwrite if already exists)
  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) }, // Expires in 5 min
    { upsert: true, new: true }
  );

  const mailOptions = {
    from: `"AmitJobsHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Email Verification OTP for AmitJobsHub",
    html: `  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.6;">
      <h2 style="color: #2c3e50;">Dear User,</h2>
      <h3>Your One-Time Password (OTP) for email verification is: 
          <span style="color: #007bff; font-weight: bold;">${otp}</span>.
      </h3>
      <h4>Please use this OTP within the next <strong>5 minutes</strong> to complete your verification process.</h4>
      <p>If you did not request this verification, please ignore this email.</p>
      <h4>Best Regards,</h4>
      <h3 style="color: #2c3e50;">AmitJobsHub Team</h3>
  </div>`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Endpoint to verify OTP
app.post("/verify-otp", async (req, res) => {
  const { username, email, otp, password ,userType } = req.body;
  if (!email || !otp || !password || !userType) return res.status(400).json({ message: "All fields are required" });

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ success: false, message: "user Already existsss" });
  }
  const storedOtp = await Otp.findOne({ email });
  if (!storedOtp) return res.status(400).json({ message: "OTP not found" });

  if (storedOtp.otp !== otp || new Date() > storedOtp.expiresAt) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Save user in MongoDB
  const newUser = new User({ username, email, password ,userType});
  await newUser.save();

  // Delete OTP after successful verification
  await Otp.deleteOne({ email });

  res.status(200).json({ message: "User registered successfully" });
});


// for login and create token
app.post("/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    if (user.password !== password) return res.status(400).json({ error: "Invalid email or password" });
    if (user.userType !== userType) return res.status(400).json({ error: "Invalid UserType" });

    let  token = JTW.sign({id :user._id , Role: user.userType} ,process.env.JWT_SECRET, { expiresIn: "1h" }) 
    let userData = user.toObject();
    delete userData.password;
    res.status(200).json({ message: "Login successful",
      user: userData , token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/update', async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true }
    );

    res.json({ updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
// for deleting user or client by admin
app.delete('/del/:id',async(req,res)=>{
  try {
    const {id}=req.params
    const userD = await User.findByIdAndDelete(id);
    if(!userD){
      res.status(404).json({message:"User not Found"})
    }
    res.status(200).json({message:"User Deleted successfully"});
  } catch (error) {
    res.status(500).json({message:"Server Error"})
  }
})

//for profile update
app.post("/ucprofileUpdate", upload.single("profileImage"), async (req, res) => {
  try {
    const {username, email, phone, gender, address, dob, overview,
           title, rate,skills, project, languages} = req.body;

    // Ensure education is always an array
    const education = JSON.parse(req.body.education || "[]");
    // console.log(education);
    // Build update object
    let updateData = {username, email, phone, gender, address, dob,
      overview, title, rate,skills, project, languages, education,};

    // Handle profile image update
    if (req.file) {
      updateData.profileImage = `http://localhost:5200/profileImage/${req.file.filename}`;
    }
    // Find and update user profile
    const updatedUser = await User.findOneAndUpdate({ email }, updateData,education, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not Found" });
    }
    // Return updated user data
    res.status(200).json({
      message: "User Profile Updated Successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/clientprofileUpdate", upload.single("profileImage"), async (req, res) => {
  try {
    const {username, email, phone, gender, address, dob,} = req.body;
    // Build update object
    let updateData = {username, email, phone, gender, address, dob,};

    // Handle profile image update
    if (req.file) {
      updateData.profileImage = `http://localhost:5200/profileImage/${req.file.filename}`;
    }
    // Find and update user profile
    const updatedUser = await User.findOneAndUpdate({ email }, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not Found" });
    }
    // Return updated user data
    res.status(200).json({
      message: "User Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = app;
