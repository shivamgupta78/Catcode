const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis.js');
const User = require('../models/user.js');

const tokenvalidation = async (req,res,next) => {
    try {
        const { token } = req.cookies;
        if(!token){
            throw new Error("No token provided");
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET,)
        const {_id} = payload;
        if(!_id){   
            throw new Error("Invalid token");
        }
        const result = await User.findById(_id);
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

module.exports = tokenvalidation; 