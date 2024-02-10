var express = require('express');
var router = express.Router();
let userModel = require("./users");
let postModel = require("./post");
let passport = require('passport');
let localStrategy = require('passport-local');
const upload = require('./multer');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/register",(req,res) => {  
   res.render("register" ,{nav: false});
});

router.get("/login",(req,res) => {
 
   res.render("login",{nav: false, err: req.flash('error')});
});
//get profile
router.get("/profile",isLoggedIn,async(req,res) => {
   let user = 
   await userModel
   .findOne({username: req.session.passport.user})
   .populate("posts");
   console.log(user);
    res.render('profile',{user, nav: true});
});


//post registration  
router.post("/register", (req, res) => {
   let userdata = new userModel({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      bio: req.body.bio,
      password: req.body.password,
   });

   userModel.register(userdata, req.body.password)
   .then(function(registeruser) {
       passport.authenticate("local")(req, res, function() {
         res.redirect("/profile");
       });
   })
   .catch(function(err) {
       console.error(err);
       res.redirect("/register");
   });
});

//user login 
router.post("/login", passport.authenticate("local", {
     successRedirect:"/profile",
     failureRedirect: "/login",
     failureFlash: true,
}),function(req,res) { })

//user logout 
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
       if(err) { return next(err) };
       res.redirect("/login");
    });
});

function isLoggedIn(req,res,next) {
   if(req.isAuthenticated()) {
      return next();
   }
   res.redirect("/login");
}

//profile pic  upload
 router.post("/profileUpload",isLoggedIn,upload.single("proimage"),async (req,res) => {
    let user = await userModel.findOne({username: req.session.passport.user});
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
 });


 //profile cover upload
 router.post("/coverUpload", isLoggedIn, upload.single("coverimg"), async (req, res) => {
   try {
       let user = await userModel.findOne({ username: req.session.passport.user });

       // Assuming `coverImage` is a field in your user model
       // Assuming you are storing the file name in the database
       user.coverImage = req.file.filename; // or req.file.path depending on your storage configuration

       await user.save();
       res.redirect("/profile");
   } catch (err) {
       console.error(err);
       res.status(500).send("Internal Server Error");
   }
});
//blog post
router.post("/creatBlog",isLoggedIn,upload.single("postimage"),async (req,res) => {
   let user = await userModel.findOne({username: req.session.passport.user});
   let post = await postModel.create({
      image: req.file.filename,
      postTitle: req.body.title,
      postDes: req.body.blog,
      user:  user._id,
   });
   user.posts.push(post._id);
   await user.save();
   res.redirect("/profile");
   
});

//addpost 
router.get("/addpost", isLoggedIn, async (req, res) => {
   try {
       let user = await userModel.findOne({ username: req.session.passport.user });
       res.render('add', { user, nav: true }); // Pass the user object to the view
   } catch (error) {
       console.error(error);
       res.status(500).send("Internal Server Error");
   }
});
//feed 
router.get("/feed", isLoggedIn, async(req,res,next) => {
   let user = await userModel.findOne({ username: req.session.passport.user });
   let posts = await postModel.find().populate("users");
   console.log(posts);
   console.log(user);
   res.render('feed',{user, posts, nav: true});
});






module.exports = router;
