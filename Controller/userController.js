const express = require("express");
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { connectDB } = require("../Config/db");
const { User, userSchema } = require("../Models/register");
userSchema


const register=async(req,res)=>{
    try {
        //get all data from
        const { name, email, password, age, address } = req.body;
    
        //all data should exists
        if (!(name && email && password && age && address)) {
          res.status(400).send("All fields are compulsory");
        }
    
        //check if user already exists - email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          res.status(400).send("User already exists with this email");
        } else {
          // encrypt the password
          const myEncPassword = await bcrypt.hash(password, 10);
    
          //save the user in DB
          const user = await User.create({
            name,
            email,
            password: myEncPassword,
            age,
            address,
          });
    
          // generate a token for user and send it
          const token = jwt.sign(
            //payload: extracts user id
            { id: user._id, email },
            //Now provide secret
            "shhhh", //process.env.jwtsecret
            {
              expiresIn: "2h",
            }
          );
    
          user.token = token;
          user.password = undefined; //now this will not go to the frontend
    
          res.status(201).json(user);
        }
      } catch (error) {
        console.log(error);
      }
}

const login=async(req,res)=>{
    try {
        // get all data from frontend
        const { email, password } = req.body;
        //validation check
        if (!(email && password)) {
          res.status(400).send("Send all data");
        }
        // find user in DB
        const user = await User.findOne({ email });
        //Assignment: If user is not there, then what?
        // match the password
      if (user && (await bcrypt.compare(password, user.password))) {      
        const token = jwt.sign(
          {id:user._id , email:user.email},
          "shhhh", // Use process.env.jwtsecret in production
          {
            expiresIn: "2h",
          }
        );
    
          // Set the token in the response headers (or you can send it in the response body)
          res.setHeader('Authorization', `Bearer ${token}`);
    
          // Send the user data without the password and the token
          const userWithoutPasswordAndToken = { ...user.toObject() };
          delete userWithoutPasswordAndToken.password;
          delete userWithoutPasswordAndToken.token;
    
          res.status(200).json({
            user:userWithoutPasswordAndToken,
            token,
          });
      } else{
        res.status(400).send("Enter correct email and password");
      }
      } catch (error) {
        console.log(error);
      }
}


module.exports={register,login}