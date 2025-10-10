const express = require("express");
const User = require("../models/userSchema");
const Job = require('../models/JobSchema');
const JTW = require('jsonwebtoken')
// const app = express(); // ❌ REMOVED: Use router instead
const dotenv = require("dotenv");
const multer = require('multer');
const cors = require('cors');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Otp = require('../models/userOtpSchema');
const jwtDecode = require('jwt-decode');
const path = require('path');

dotenv.config();

// ✅ FIX: Use express.Router() to create a modular, mountable router
const router = express.Router(); 

// Middleware applied to this router
router.use(express.json()); 
router.use(cors()); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
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

// Store OTPs in memory for faster access (complementary to DB)
const memoryOtpStore = new Map();

// Async function to send email (doesn't block main response)
async function sendOtpEmail(email, otp) {
  try {
    const mailOptions = {
      from: `"AmitJobsHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Email Verification OTP for AmitJobsHub",
      html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #00b894; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AmitJobHub</h1>
        </div>
        <div style="padding: 30px; text-align: center;">
          <img src="https://i.ibb.co/hRW1BJZS/8133820.png" alt="Verify Icon" width="60" style="margin-bottom: 20px;" />
          <h2>Verify Your Email Address</h2>
          <p style="font-size: 16px; color: #000000ff;">Verify your email to finish signing up with AmitJobHub. Use the following verification code:</p>
          <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #00b894;">${otp}</div>
          <p style="color: #888;">The verification code is valid for 10 minutes.</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #666;">
          For any queries or concerns, feel free to contact us by replying to this email.
        </div>
      </div>
      `
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error);
    throw error;
  }
}

// Optimized OTP sending route - responds immediately
// 🚨 FIX: Routes are now on the router instance
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in memory for immediate verification
    memoryOtpStore.set(email, { otp, expiresAt: expiresAt.getTime() });

    // Save OTP in MongoDB in background (don't wait for it)
    Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    ).catch(console.error); // Don't block response on DB save

    // For development/testing - always respond quickly
    const responseData = {
      message: "OTP sent successfully",
      email: email,
      // Development feature - include OTP in response for testing
      ...(process.env.NODE_ENV !== 'production' && { debugOtp: otp })
    };

    // Send email in background without waiting
    sendOtpEmail(email, otp).catch(error => {
      console.error(`Email sending failed for ${email}:`, error);
    });

    // Respond immediately without waiting for email
    res.status(200).json(responseData);

  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ 
      message: "Error processing OTP request",
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
});

router.get("/test-email-config", async (req, res) => {
  try {
    const testEmail = "test@example.com";
    const testOtp = "123456";
    
    console.log('🧪 Testing email configuration...');
    
    if (!transporter) {
      return res.json({
        success: false,
        message: "Email transporter not configured",
        reason: "Missing EMAIL_USER or EMAIL_PASS environment variables",
        solution: "Check Render environment variables"
      });
    }

    // Test transporter connection
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');

    // Try sending test email
    const testResult = await sendOtpEmail(testEmail, testOtp);
    
    res.json({
      success: true,
      message: "Email configuration test completed",
      transporter: "Connected and verified",
      emailService: "Gmail",
      testResult: testResult
    });

  } catch (error) {
    console.error('❌ Email config test failed:', error);
    res.status(500).json({
      success: false,
      message: "Email configuration test failed",
      error: error.message
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { username, email, otp, password, userType } = req.body;

    if (!email || !otp || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    let isValidOtp = false;
    let otpSource = 'none';

    // First check memory store (fastest)
    const memoryOtp = memoryOtpStore.get(email);
    if (memoryOtp && memoryOtp.otp === otp && Date.now() < memoryOtp.expiresAt) {
      isValidOtp = true;
      otpSource = 'memory';
      memoryOtpStore.delete(email); // Clear from memory after use
    } 
    // Then check database
    else {
      const storedOtp = await Otp.findOne({ email });
      if (storedOtp && storedOtp.otp === otp && new Date() < storedOtp.expiresAt) {
        isValidOtp = true;
        otpSource = 'database';
        await Otp.deleteOne({ email }); // Clear from DB after use
      }
    }

    // Development bypass - accept any OTP that starts with "123"
    if (!isValidOtp && process.env.NODE_ENV !== 'production' && otp.startsWith('123')) {
      console.log(`🔧 Development OTP bypass for: ${email}`);
      isValidOtp = true;
      otpSource = 'development';
    }

    if (!isValidOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Create new user
    const newUser = new User({ username, email, password, userType });
    await newUser.save();

    console.log(`User registered: ${email} (OTP from: ${otpSource})`);

    res.status(200).json({ 
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        userType: newUser.userType
      }
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    res.status(500).json({ 
      message: "Registration failed",
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
});

// for login and create token
router.post("/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    if (user.password !== password) return res.status(400).json({ error: "Invalid email or password" });
    if (user.userType !== userType) return res.status(400).json({ error: "Invalid UserType" });

    let token = JTW.sign({ id: user._id, Role: user.userType }, process.env.JWT_SECRET, { expiresIn: "48h" });
    let userData = user.toObject();
    delete userData.password;
    res.status(200).json({
      message: "Login successful",
      user: userData, token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/google-login", async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    if (!email || !googleId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        googleId,
        username: name,
        password: "google-login-secret", // dummy password
      });
      await user.save();
    }

    const token = JTW.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ success: true, user, token });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/update', async (req, res) => {
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
router.delete('/del/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userD = await User.findByIdAndDelete(id);
    if (!userD) {
      res.status(404).json({ message: "User not Found" })
    }
    res.status(200).json({ message: "User Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
})

//for profile update
router.post('/ucprofileUpdate', upload.single("profileImage"), async (req, res) => {
  try {
    const userId = req.body._id || req.user._id;
    const updateData = { ...req.body };

    // Handle education data
    if (req.body.education) {
      updateData.education = JSON.parse(JSON.stringify(req.body.education));
    }

    // Handle file upload
    if (req.file) {
      updateData.profileImage = `http://job-search-project-330t.onrender.com/profileImage/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(201).json({ message: "Profile updated successfully", user: updatedUser, });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

router.post("/clientprofileUpdate", upload.single("profileImage"), async (req, res) => {
  try {
    const { username, email, phone, gender, address, dob } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required to update profile" });
    }

    let updateData = { username, email, phone, gender, address, dob };

    if (req.file) {
      const imageUrl = `http://job-search-project-330t.onrender.com/profileImage/${req.file.filename}`;
      updateData.profileImage = imageUrl;
    }

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    res.status(200).json({
      message: "User Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error in /clientprofileUpdate:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      stack: error.stack,
    });
  }
});

// for saved job routes
router.post('/save-job', async (req, res) => {
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

router.get('/:userId/saved-jobs', async (req, res) => {
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

// Send Reset Password Link via Email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate token
    const resetToken = JTW.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Send Email
    const resetLink = `https://amitjobhub.netlify.app/resetpassword/${resetToken}`; // Frontend link
    await transporter.sendMail({
      from: `"AmitJobsHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "AmitJobsHub Password Reset Link",
      html: `
        <h2>Password Reset Requested</h2>
        <p>Click the link below to reset your password. This link will expire in 15 minutes.</p>
        <a href="${resetLink}">Reset Password</a>
      `,
    });

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password using Token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = JTW.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword; // (Optional: hash password in production)
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// ✅ FIX: Export the router instance
module.exports = router;