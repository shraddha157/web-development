const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
     user_email : {
         type:String,
         default: ''
     },
     u_name:{
         type:String,
         default: ''
     },
     post_content: {
         type: String,
         default:'No'
     },
     
     upload_image:{
         type:String,
         default:""
     },
     like_count:{
         type:Number,
         default:''
     },

     post_date:{
      type: Date,
     default: () => Date.now() 
     }
     

 });
 
 module.exports = mongoose.model('posts',postSchema);