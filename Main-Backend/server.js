const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./mongoDB");
const userRoutes = require("./routes/userRoutes");
const jobOfferRoutes = require('./routes/Client');
const AdminRoutes =  require('./routes/AdminRoutes');
const JobRoutes = require("./routes/jobRoutes");
const Favroit = require("./routes/favroit")
const verifyToken = require("./authorizationMiddleware/clientAuth")
require ('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

 
connectDB();
app.use("/api/Ajobs", JobRoutes); 
app.use("/api/users", userRoutes); 
app.use('/api/jobs', verifyToken ,jobOfferRoutes);
app.use('/api/Admin', AdminRoutes);
app.use('/api/Favroit', Favroit);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5200;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
