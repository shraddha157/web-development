const mongoose = require('mongoose');


const usersSchema = new mongoose.Schema({
    f_name : String,
    L_name : String,
    u_name : {
        type: String,
        default: ''
    },
    discribe_user : {
        type: String,
        default: ''
    },
    relationship: {
        type: String,
        default: ''
    },
    user_pass : String,
    User_email :  {type: String, 
                unique: true,
                match:/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i 
            } ,       
    user_country : String,
    user_gender : String,
    user_birthday : String,
    user_image: {
        type: String,
        default: "\\uploads\\cover\\imagesd.png"
    },

    user_cover: {
        type: String,
        default: "\\uploads\\cover\\nature-design.jpg"
    },
    user_reg_date : {
        type: Date,
        default: () => Date.now() 
      },
    status : {
        type: String,
        default: "Hey There!.. I'm using Chit Chat"
    },
    posts :  {
        type: String,
        default: 'no'
    },
    recovery_account :  {
        type: String,
        default: 'admin@gmail.com'
    }

 }); 


 module.exports = mongoose.model('users',usersSchema);

 