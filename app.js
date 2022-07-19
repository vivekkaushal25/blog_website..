//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const encrypt= require("mongoose-encryption");


const homeStartingContent = "This website gives a platform where one can share their knowledge and experience to the world. So if you feel you can share someting to this world then you can share your thoughts freely on this platform.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae..";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque..";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex",true);

const postSchema = {
  title: String,
  content: String,
  author: String
};
const userSchema= new mongoose.Schema({
  email: String,
  password: String
});

const secret = "Thisismysecretusedforencryption";
userSchema.plugin(encrypt,{ secret: secret, encryptedFields: ["password"]});



// userSchema.plugin(passportLocalMongoose);

const User= new mongoose.model("User",userSchema);


const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){
  Post.find({}, function(err, posts){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    });

  });


app.get("/compose", function(req, res){
  res.render("firstScreen");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    author: req.body.Author
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content,
      author: req.body.Author
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

//login and register

app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const username=req.body.username;
  const newUser= new User({
    email: req.body.username,
    password: req.body.password
  });
  User.findOne({email: username},function(err,foundUser){
    if(err)
    {
      console.log(err);
    }
    else{
      if(foundUser){
        res.render("register");
      }
      else{
        newUser.save(function(err){
          if(err){
            console.log("yes");
            console.log(err);
          }
          else{
            res.render("compose");
          }
        });
      }
    }
  });

});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({email: username},function(err,foundUser){
    if(err)
    {
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("compose");
        }
      }
      else
      {
        res.render("login");
      }
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});



  // Post.find({ _id:requestedPostId }).deleteOne().exec();
