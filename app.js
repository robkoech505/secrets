//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
//this is how we access secrets using dotenv
//console.log(process.env.SECRET);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//create a new db//
mongoose.connect("'mongodb://localhost:27017/userDB",  {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

//create a new Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    
  },
  password: {
    type: String,
    required: true
  }
});

//defining the secret make sure thhis is put before the mongoose model
userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
res.render("home");
});

app.get("/login", function(req,res){
res.render("login");
});

app.get("/register", function(req,res){
res.render("register");
});

app.post("/register", function(req,res){

const newUser = new User({
  password:req.body.password,
  email:req.body.username
});

newUser.save(function(err){
  if(err){
    res.render(err);
  }else{
    res.render("secrets");
  }
});
});

app.post("/login", function(req,res){

  const username = req.body.username;
  const password = req.body.password;

  //look through all users to see if a password exists
  User.findOne({email:username}, function(err, foundUser){
    if(err){
      console.log("fuck");

      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
