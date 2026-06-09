const User = require('../models/user'); 
const validator = require('../utils/validator'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis.js');

const register = async (req,res)=>{
    try{
        const {firstName,email,password} = req.body;
        //validate the data
        await validator(req.body);
        req.body.password = await bcrypt.hash(password,10);
        req.body.role = "user";

        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id,email:user.email,role:'user'}, process.env.JWT_SECRET, {expiresIn:3600});
           const reply = {
            firstName:user.firstName,
            email:user.email,
            _id:user._id,
            role:user.role
        }

        res.status(201).json({
            message:"User created successfully", 
            user:reply,
            token:token,
        });

    } catch(err){

            res.status(400).json({message:"Error creating user", err: err.message});
    }
}


const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
          throw new Error("Email and password are required");
        }
        const user = await User.findOne({email});
        if(!user){
            throw new Error("User not found");
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            throw new Error("Invalid Credentials");
        }

        const reply = {
            firstName:user.firstName,
            email:user.email,
            _id:user._id,
            role:user.role
        }
         const token = jwt.sign({_id:user._id,email:email, role:user.role}, process.env.JWT_SECRET, {expiresIn:"1h"});
        res.status(200).json({
            user:reply,
            token:token,
            message:"login successfully"
        })
    } catch(err){
         res.status(400).json({message:"Error logging user", err: err.message});
    }
}

const logout = async (req,res) => {
      console.log(req.cookies);
    try{
        const { token } = req.cookies;
        if(!token){
            throw new Error("No token found");
        }

        const payload = jwt.decode(token);
        if(!payload){
            throw new Error("Invalid token");
        }

        await redisClient.set(`token:${token}`,"blocked");
        await redisClient.expireAt(`token:${token}`,payload.exp);
        res.cookie("token",null,new Date(Date.now()));
        // res.clearCookie("token");
        res.status(200).json({message:"Logged out successfully"});
        
    } catch (err){
        res.status(500).json({message:"Error logging out", err: err.message});

    }
}

const getProfile = async (req,res) => {

}

const adminRegister = async (req,res) => {
  
    try{
        const {firstName,email,password} = req.body;
        //validate the data
        await validator(req.body);
        req.body.password = await bcrypt.hash(password,10);

        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id,email:user.email,role:user.role}, process.env.JWT_SECRET, {expiresIn:3600});
        res.cookie('token',token,{maxAge:3600000});

        res.status(201).json({message:"User created successfully", user});

    } catch(err){

            res.status(400).json({message:"Error creating user", err: err.message});
    }
}



module.exports = {register, login,logout,getProfile,adminRegister};