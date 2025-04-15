const express = require("express");
const User = require("../models/userSchema");
const Job = require('../models/JobSchema');
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
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});
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
    html:  `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #00b894; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">AmitJobHub</h1>
      </div>
      <div style="padding: 30px; text-align: center;">
        <img src="https://i.ibb.co/hRW1BJZS/8133820.png" alt="Verify Icon" width="60" style="margin-bottom: 20px;" />
        <h2>Verify Your Email Address</h2>
        <p style="font-size: 16px; color: #444;">Verify your email to finish signing up with AmitJobHub. Use the following verification code:</p>
        <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #00b894;">${otp}</div>
        <p style="color: #888;">The verification code is valid for 5 minutes.</p>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #666;">
        For any queries or concerns, feel free to contact us by replying to this email.
      </div>
    </div>
    `
  
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
app.post('/ucprofileUpdate', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.body._id || req.user._id;
    const updateData = { ...req.body };

    // Handle education data
    if (req.body.education) {
      updateData.education = JSON.parse(JSON.stringify(req.body.education));
    }

    // Handle file upload
    if (req.file) {
      updateData.profileImage = `http://job-search-project-330t.onrender.com/uploads/profile-images/${req.file.filename}`;
      
    }

    const updatedUser = await User.findByIdAndUpdate(userId,updateData, { new: true });
    res.status(201).json({ message: "Profile updated successfully", user: updatedUser,});

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Error updating profile",error: error.message });
  }
});

app.post("/clientprofileUpdate", upload.single("profileImage"), async (req, res) => {
  try {
    const {username, email, phone, gender, address, dob,} = req.body;
    // Build update object
    let updateData = {username, email, phone, gender, address, dob,};

    // Handle profile image update
    if (req.file) {
      updateData.profileImage = `http://job-search-project-330t.onrender.com/profileImage/${req.file.filename}`;
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


// for saved job routes

app.post('/save-job', async (req, res) => {
  try {
      const { userId, jobId } = req.body;

      if (!userId || !jobId) {
          return res.status(400).json({ success: false, message: "User ID and Job ID are required" });
      }

      // Find the user and update savedJobs
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      if (user.savedJobs.includes(jobId)) {
          // Remove from savedJobs if already present (toggle feature)
          user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
      } else {
          user.savedJobs.push(jobId);
      }

      await user.save();

      res.status(200).json({ success: true, savedJobs: user.savedJobs });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error });
  }
});

app.get('/:userId/saved-jobs', async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("savedJobs");

      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      res.status(200).json({ success: true, savedJobs: user.favorites });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = app;
