const express = require('express');
const Admin = require('../models/AdminSchema');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");
// const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const otpStorage = {};

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
 
// Admin Signup Route
app.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Please verify your email first!" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: "Email not verified. Verify OTP first!" });
    }

    user.username = username;
    user.password = password;
    await user.save();

    res.status(200).json({ success: true, message: "SignUp successful!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// Endpoint to send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required!" });

  const existingUser = await Admin.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already registered!" });
  }

  const otp = generateOTP();
  const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

  try {
    await Admin.findOneAndUpdate(
      { email },
      { otp, otpExpiry: expiryTime },
      { new: true, upsert: true } // Create or update user record
    );

    const mailOptions = {
      from: `"Amit-Hotel-Room-Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Email Verification OTP for Amit-Hotel-Room-Booking",
      text: `Dear User,\n\nYour OTP for email verification is: ${otp}.\n\nThis OTP is valid for 10 minutes.\n\nThank you,\nAmit-Hotel-Room-Booking Team`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent for email verification!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});


// Endpoint to resend OTP
app.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required!" });

  const storedOtpData = otpStorage[email];

  // If OTP doesn't exist or has expired, resend a new OTP
  if (!storedOtpData || Date.now() > storedOtpData.expiryTime) {
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // otpStorage[email] = { otp, expiryTime }; // Store new OTP with new expiration time

        // Update or insert OTP for the user in the database
        const admin = await Admin.findOneAndUpdate(
          { email },
          { otp:[  otp , {expiryTime: expiryTime} ]},
          { new: true, upsert: true } //  upsert: true <--- Creates a new record if the user doesn’t exist
        );
    
    const mailOptions = {
      from: `"Amit-Hotel-Room Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your OTP for Amit-Hotel-Room Booking (Resend)",
      text: `Dear Customer,

Your One-Time Password (OTP) for Amit-Hotel-Room Booking is: ${otp}.

This OTP is valid for 10 minutes. Do not share this code with anyone.

Thank you,
Amit-Hotel-Room Booking Team`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "OTP resent successfully!" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
  } else {
    res.json({ success: false, message: "OTP is still valid. Please check your email." });
  }
});

// Endpoint to verify OTP
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required!" });

  try {
    const user = await Admin.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: "OTP not found. Please request a new one." });
    }
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });
    }

    if (user.otp === otp) {
      user.isVerified = true; // Mark email as verified
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      res.json({ success: true, message: "Email verified successfully! You can now sign up." });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP. Try again." });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Admin Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if(!user){
      res.status(404).json({message:"User not Found"})
    }
    if(user.password !== password){
      res.status(401).json({message:"Password not match"})
    } else {
      const token = jwt.sign({id:user._id },"amit25",{expiresIn:"1h"});
      // console.log(token)
      res.status(200).json({message:"Login Successfully",user,token})
    }
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err });
  }
});


// Get All Admin
app.get('/sub', async (req, res) => {
  try {
    const users = await Admin.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// Get Admin by Email (for editing)
app.get('/update/:email', async (req, res) => {
  const emailId = req.params.email;
  try {
    const user = await Admin.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
});

// Update Admin  Data by Email (username and password)
app.put('/update/:email', async (req, res) => {
  const { username, password } = req.body;
  const emailId = req.params.email;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields (username, password) are required' });
  }

  try {
    const updatedUser = await Admin.findOneAndUpdate(
      { emailId },
      {  username,  password },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
  }
});

// Delete User by Email
app.delete('/sub/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const user = await Admin.findOne({  email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

module.exports = app;
