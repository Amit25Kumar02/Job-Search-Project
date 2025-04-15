const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Contact = require('../models/contactUsSchema');

// Parse JSON body
app.use(express.json()); 

app.post('/contact', async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      
      if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newContact = new Contact({ name, email, phone, message }); 
      await newContact.save();
      res.status(201).json({ message: "Contact submitted successfully" });
    } catch (error) {
      console.error("Error in POST /contact:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });

app.get('/getContact', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error in GET /getContact:", error);
        res.status(500).json({ message: "Server Error while fetching contacts" });
    }
});
app.delete('/del/:id',async(req,res)=>{
  try {
    const {id}=req.params
    const userD = await Contact.findByIdAndDelete(id);
    if(!userD){
      res.status(404).json({message:"User not Found"})
    }
    res.status(200).json({message:"User Deleted successfully"});
  } catch (error) {
    res.status(500).json({message:"Server Error"})
  }
})

module.exports = app;
