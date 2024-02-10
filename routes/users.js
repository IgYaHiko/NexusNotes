const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/NexusDB");

const userSchema = new mongoose.Schema({
   username: {
      type: String,
      unique: true,
      required: true,
      
 },
    fullname: {
    type: String,
    unique: true,
    required: true,
   
 },
 email: {
    type: String,
    unique: true,
    required: true,
 },
 posts:[{
   type: mongoose.Schema.Types.ObjectId,
   ref:  'Post',
 }],
 password: {
    type: String,
    unique: true,
    
 },
 bio: {
   type: String,
   maxlength: 200, // Set the maximum word limit for the bio
},
  profileImage: String,
  coverImage: String,
 

});
userSchema.plugin(plm);
module.exports = mongoose.model("User",userSchema);