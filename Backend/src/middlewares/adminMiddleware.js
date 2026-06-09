const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis.js');
const User = require('../models/user.js');

const adminMiddleware = async (req,res,next) => {
    try {
       const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split('')[1];
        if(!token){
            return res.status(401).json({message:"Invalid token", err:"No token provided"})
        }
        const payload = await jwt.verify(token, process.env.JWT_SECRET,)
        const {_id} = payload;
        if(!_id){   
            throw new Error("Invalid token");
        }
        const result = await User.findById(_id);
        if(payload.role !== "admin"){
            throw new Error("Unauthorized access");
        }
        if(!result){
            throw new Error("User not found");
        }

        //checking user in redis blocklist
        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked){
            throw new Error("Token is blocked");
        }
        req.result = result;
        next();

    }catch(err){
        res.status(401).json({message:"Invalid token", err: err.message});
    }
}

module.exports = adminMiddleware; 