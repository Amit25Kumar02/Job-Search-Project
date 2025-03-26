const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username:{type:String,required:true},
  email:{type:String , required:true  },
  password:{type:String,required:true},
  dob:{type:Date},
  phone:{type:String},
  address:{type:String},
  profile:{type:String},
  gender:{type:String ,enum:["Male","Female","Other"]},
  CreatedAt:{type:Date,default:Date.now} 
})
const Admin = mongoose.model("adminn",AdminSchema);

module.exports = Admin




