const express = require("express");
const User = require("../models/userSchema");
const JTW = require('jsonwebtoken')
const app = express();
const dotenv = require ("dotenv");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
dotenv.config();
app.use(express.json()); 

const userDir =path.join(__dirname,"./profileImage");
if(!fs.existsSync(userDir)){
  fs.mkdirSync(userDir,{recursive:true});
}
const storage =multer.diskStorage({
  destination:(req,file,cb)=>cb(null,userDir),
  filename:(req,file,cb)=>cb(null.date.now()+"-"+file.originalname)
})
const upload = multer({storage});

// for signup by user and client
app.post("/signup", async (req, res) => {
  try {
    const { username, email, phone, password, userType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });
    const newUser = new User({ username, email, phone, password, userType });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
app.post('/ucprofileUpdate',upload.single("profileImage"),async(req,res)=>{
  try {
    const {username,email,phone,gender,address,dob}=req.body;
    // console.log("body line : ",req.body);
    const userP = await User.findOneAndUpdate({email},{username,email,phone,gender,address,dob},{new:true});
    if(!userP){
      res.status(404).json({message:"User not Found"})
    }
    // console.log("User save line :",userP);
    await userP.save();
    res.status(200).json({message:"User & Client Profile Update successfully"});
  } catch (error) {
    res.status(500).json({message:"Server error"});
  }
})


module.exports = app;
