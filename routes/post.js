const mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
     image: {
         type: String,
     },
     postTitle: {
         type: String,
         required: true,
     },
     postDes: {
        type: String,
        required: true,

     },
     users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
     }
})

module.exports = mongoose.model( "Post", postSchema);  //export the model to be used in other files
