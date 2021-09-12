const express = require('express');
const sn = express();
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var fs = require('fs');
var path = require('path');
var sess = require('express-session');
const users = require('../models/sn');
const posts = require('../models/post');
const multer = require('multer');
const methodOverride = require('method-override');
var session = require('express-session');
const  db  = require('../models/sn');



//set image storage
let storage = multer.diskStorage({
    destination: './public/uploads/cover/',
    filename: (req, file, cb) => {
        cb(null,file.originalname)
    }
});

let upload = multer({
    storage: storage,
    fileFilter : (req, file, cb) => {
        checkFileType(file,cb);
    }
});

function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif|jfif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if(extname){
        return cb(null,true)
    } 
    else 
    {
        cb('Error: Please images only.');
    }

}




router.get('/',(req,res) => {
    res.render('main');
});

router.get('/signup',(req,res)=>{
    res.render('signup.ejs');
});
 

router.get('/signin',(req,res)=>{
   
    res.render('signin.ejs');
});


router.get('/home',(req,res)=>{ 
   // sess = req.session;
    if(req.session.user.User_email ) {
        name = req.session.user.f_name;
        uname = req.session.user.u_name;
    }
       // res.write(`<h1>Hello ${sess.email} </h1><br>`);
      //  res.end('<a href='+'/home'+'>Logout</a>');
      posts.find({}).sort({post_date : -1})
      .exec()
      .then(post => {
          if(post.length>0){
          req.session.post = post;
          }
      
      res.render('home.ejs',{currentpost:post});
    });
    
});


router.get('/home/members',(req,res)=>{
    if(req.session.user.User_email) {
        name = req.session.user.f_name;
        uname = req.session.user.u_name;
    }
    
           res.render('members.ejs');

});

router.get('/members/search1/:data',(req,res)=>{
    if(req.session.user.User_email) {
        name = req.session.user.f_name;
        uname = req.session.user.u_name;
    }
        var urlData = req.params.data;
        console.log(urlData);
        let searchQuery = ({$or:[{u_name:req.params.data},{f_name:req.params.data}]})
        users.findOne(searchQuery)
        .then(user => {
            res.render('search1',{susers:user});
        })
        .catch(err => {
            console.log(err);
        })
    
          
});


router.get('/members/search',(req,res)=>{
    if(req.session.user.User_email) {
        name = req.session.user.f_name;
        uname = req.session.user.u_name;
    }
    
           res.render('search',{susers:""});

});
router.get('/home/member/search',(req,res)=>{
     //var name=req.body.search2;
    let searchQuery = ({$or:[{u_name:req.query.search2},{f_name:req.query.search2}]})
   
    
   // users.find({u_name:/z/})
    users.findOne(searchQuery)
    .then(user => {
        res.render('search',{susers:user});
    })
    .catch(err => {
        console.log(err);
    })
}); 

router.get('/home/chat',(req,res)=>{
    if(req.session.user.User_email ) {
        name = req.session.user.f_name;
        uname = req.session.user.u_name;
    }
       // res.write(`<h1>Hello ${sess.email} </h1><br>`);
      //  res.end('<a href='+'/home'+'>Logout</a>');
      users.find({})
      .exec()
      .then(user => {
          if(user.length>0){
          req.session.user = user;
          }
      
      res.render('chat',{alluser:user});
    });
    
});






router.get('/home/profile',(req,res)=>{
    
   
    if(req.session.user.User_email) {
        name = req.session.user.f_name; 
        uname = req.session.user.u_name;
    }
    posts.find({user_email: req.session.user.User_email}).sort({post_date : -1})
    .exec()
    .then(post => {
        if(post.length>0){
           // post.save();
            req.session.post = post;
        }
        res.render('profile.ejs',{currentUser:req.session.user, currentpost:post});
    })
    
});








// create users
router.post('/signup',(req,res,next)=>{
    const file = req.file;
    console.log(req.body);
    var fn=req.body.first_name;
    var ln = req.body.last_name;
    
    function between(min, max) {  
        return Math.floor(
          Math.random() * (max - min) + min
        )
      }
      var un = (fn+ln+'_'+between(100,100000))
    var pass = req.body.u_pass;
    if(pass.length <=8){
        //return res.status(409).json({
           // message: 'Password should be minimum 9 characters!'
           req.flash('success_msg','Password should be minimum 9 characters!');
           res.redirect('/signup');
       // })
    }
   
    users.find({User_email : req.body.u_email})
    .exec()
    .then(user => {
        if(user.length >=1){
            
        //mail exits
       // return res.status(409).json({
           // message: ' E-mail already registered! '
           req.flash('success_msg','E-mail already registered!');
           res.redirect('/signup');
       // });
        }
       
   
     else {
         //generate new user
         bcrypt.hash(req.body.u_pass, 10 ,(err,hash)=>{
           

            if(err){
                console.log(err);
                return res.status(500).json({
                    error : err
                });
            }
           
       else{
    let newuser = {
        f_name : req.body.first_name,
        L_name : req.body.last_name,
        u_name : un,
        user_pass :hash,
        User_email :req.body.u_email,       
        user_country : req.body.u_country,
        user_gender : req.body.u_genger,
        user_birthday : req.body.u_birthday,

        
    }
    users.create(newuser)
    .then(user => {
        res.redirect('/signin');
    })
    .catch(err => {
        console.log(err);
    })
}
})
     }
});
});

router.post('/signin',(req,res,next)=>{
   console.log(req.body);
   
    users.findOne({User_email : req.body.email}) 
    .exec()
    .then(user => {
        if(user.length<1) {
        //incorrect mail or password
           req.flash('success_msg','This e-mail is not registered');
           res.redirect('/signin');
        }  
        else{
            bcrypt.compare(req.body.pass, user.user_pass, function(err, results){
                if(err){
                    throw new Error(err)
                 }
                 if (results) {
                    user.save();
                    req.session.user = user;
                    res.redirect('/home');
                } else {
                    req.flash('success_msg','Incorrect Password');
                    res.redirect('/signin');
                }
               })
             
                }
            
})
      
});

router.post('/home/profile/upload_cover',upload.single('u_cover'),(req,res,next)=> {
    
    const file = req.file;
     
      if(!file){
        return console.log('please select an image.');
    }
    
     let url = file.path.replace('public','');
  
     
     users.updateOne({"User_email" : req.session.user.User_email}, {$set: {"user_cover": url}})
     .then(user => {
         res.redirect('/home/profile');
     })
     .catch(err => {
      console.log(err);
     });
    
     

});
 




router.post('/home/profile/upload_profile',upload.single('u_image'),(req,res,next)=> {
    
    const file = req.file;
    
      if(!file){
        return console.log('please select an image.');
    }
    
     let urls = file.path.replace('public','');
  
     
      users.updateOne({"User_email" : req.session.user.User_email}, {$set: {"user_image": urls}})
     .then( user => {
       res.redirect('/home/profile');
     })
     .catch(err => {
       return console.log(err);
     });
    
     

});

router.post('/member',(req,res,next) => {
    const mem = req.body.search2;


});



  router.post('/home/profile/upload_image',upload.single('upload_image'),(req,res,next)=> {
    
    const file = req.file;
    const cont = req.body.content;
    
      if(!file){
          if(!cont){
       // return console.log('please select an image.');
       return console.log('nothing to post');
          }
    }
    if(file){
     let url = file.path.replace('public','');
     
    let newpost = {
        user_email: req.session.user.User_email,
        u_name:req.session.user.u_name,
        post_content: cont,
        upload_image: url
    }


    posts.create(newpost)
    .then(post => {
       // req.session.post = post;
        res.redirect('/home/profile');
    })
    .catch(err => {
        console.log(err);
    })
}
else {
    let newthought = {
        user_email: req.session.user.User_email,
        post_content: cont,
    }
    posts.create(newthought)
    .then(post =>{
        res.redirect('/home/profile');
    })
    .catch(err => {
        console.log(err);
    })

}
  
});

router.post('/profil/update_info',(req,res,next)=>{
    users.updateOne({"User_email" : req.session.user.User_email}, {$set: {"relationship": req.body.relation,"discribe_user":req.body.abtme,"status":req.body.status}})
    .then(user => {
        res.redirect('/home/profile');
    })
    .catch(err => {
     console.log(err);
    });

});



    
module.exports = router; 

router.get('*',(req,res)=>{
    res.send('404. This page does not exist. <a href="/"> Go to HomePage </a>');
});