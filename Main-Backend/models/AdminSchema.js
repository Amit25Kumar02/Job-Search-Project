const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username:{type:String,required:true},
  email:{type:String , required:true  },
  password:{type:String,required:true},
  CreatedAt:{type:Date,default:Date.now} 
})
const Admin = mongoose.model("adminn",AdminSchema);

module.exports = Admin




