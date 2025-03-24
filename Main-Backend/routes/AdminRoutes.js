const express = require('express');
const Admin = require('../models/AdminSchema');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");
const Otp = require('../models/Otpmodel.js')
// const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

// const otpStorage = {};

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

// Endpoint to send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  let user = await Admin.findOne({ email })
console.log( "user",user)
  if (user) {
    res.status(409).send({ message: 'user already exists ..' })
    return
  }
  const otp = generateOTP()

  // Save OTP in MongoDB (Overwrite if already exists)
  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }, // Expires in 10 min
    { upsert: true, new: true }
  );

  const mailOptions = {
    from: `"Amit-Hotel-Room-Booking" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Email Verification OTP for Amit-Hotel-Room-Booking",
    text: `Dear User,\n\nYour OTP for email verification is: ${otp}.\n\nThis OTP is valid for 10 minutes.\n\nThank you,\nAmit-Hotel-Room-Booking Team`,
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
  const { username, email, otp, password } = req.body;
  if (!email || !otp || !password) return res.status(400).json({ message: "All fields are required" });

  const user = await Admin.findOne({ email });
  if (user) {
    return res.status(400).json({ success: false, message: "user Already existsss" });
  }

  const storedOtp = await Otp.findOne({ email });
  if (!storedOtp) return res.status(400).json({ message: "OTP not found" });

  if (storedOtp.otp !== otp || new Date() > storedOtp.expiresAt) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Save user in MongoDB
  const newUser = new Admin({ username, email, password });
  await newUser.save();

  // Delete OTP after successful verification
  await Otp.deleteOne({ email });

  res.status(200).json({ message: "User registered successfully" });
});


// Admin Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not Found" })
    }
    if (user.password !== password) {
      res.status(401).json({ message: "Password not match" })
    } else {
      const token = jwt.sign({ id: user._id }, "amit25", { expiresIn: "1h" });
      // console.log(token)
      res.status(200).json({ message: "Login Successfully", user, token })
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
      { username, password },
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
    const user = await Admin.findOne({ email });
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
