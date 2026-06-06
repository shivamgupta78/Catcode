const express = require('express');

const authRouter = express.Router();
const {register,login,logout,getProfile,adminRegister} = require('../controllers/userAuthent');
const userMiddleware = require("../middlewares/userMiddlewares")
const adminMiddleware = require('../middlewares/adminMiddleware');



authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",userMiddleware,logout);
authRouter.get("/profile",userMiddleware,getProfile);
authRouter.post("/admin/register",adminMiddleware,adminRegister);
authRouter.get('/check',userMiddleware,async (req,res)=>{
    const reply = {
        firstName:req.result.firstName,
        email:req.result.email,
        _id:req.result._id,
        role:req.result.role
    }
    res.status(200).json({
        user:reply,
        message:"valid User"
    })
})



module.exports = authRouter;