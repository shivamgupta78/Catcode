const cloudinary = require('cloudinary').v2
const Problem = require('../models/problem')
const User = require('../models/user');
const SolutionVideo = require("../models/solutionVideo");

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const generateUploadSignature = async (req , res) =>{
    try{
        const { problemId } = req.params;
        const userId = req.result._id;
        const problem = await Problem.findById(problemId);
        if (!problem){
            return res.status(400).send("Problem not found");
        }
        const timestamp = Math.round(new Date().getTime()/1000);
        const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;
        // upload parameters 
        const uploadParams = {
            timestamp : timestamp,
            public_id:publicId,
        };

        // generate Signature 
        const signature = cloudinary.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_API_SECRET
        );
        res.json({
            signature,
            timestamp,
            public_id:publicId,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
            upload_url : `https://api.cloudinary.com/v1_1${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        });

    } catch(error){
        console.error(`Error generating upload signature`, error);
        res.status(400).send('Failed to generate upload credentials');
    }
};


const saveVideoMetadata = async (req,res) =>{
    try {
        const {
            problemId,
            CloudinaryPublicId,
            cloudinaryUrl,
            secureUrl,
            duration
        } = req.body;
        const userId = req.result._id;
        const cloudinaryResource = await cloudinary.api.resource(
            CloudinaryPublicId,
            {resource_type:'video'}
        );
        if(!cloudinaryResource){
            return res.status(400).send("video not found on cloudinary");
        }

        //checking if video already exist or not
        const existingVideo = await SolutionVideo.findOne({
            problemId,
            userId,
            CloudinaryPublicId
        });

        if(existingVideo){
            return res.status(409).send("video already exist");
        }

        //making thumbnail url 
        const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id,{
            resource_type:'image',
            transformation:[
                {width:400, heigh:225, crop:'fill'},
                {quality:'auto'},
                {start_offset:'auto'}
            ],
            format:'jpg'
        });

        //create solution record
        const videoSolution = await SolutionVideo.create({
            problemId,
            userId,
            CloudinaryPublicId,
            secureUrl,
            duration:cloudinaryResource.duration || duration,
            thumbnailUrl
        });
        // await SolutionVideo.save();

        res.status(201).json({
            message:'video solution saved successfully',
            videoSolution:{
                id:SolutionVideo._id,
                thumbnailUrl:SolutionVideo.thumbnailUrl,
                duration:SolutionVideo.duration,
                uploadAt:SolutionVideo.createAt

            }
        });
    } catch(error){
        console.error("Error saving video metadata",error);
        res.status(500).send("Failed to save video metadata");
    }
};

const deleteVideo = async (req, res)=>{
    try {
        const { videoId } = req.params;
        const userId = req.result._id;
        const video = await SolutionVideo.findByIdAndDelete(videoId);
        if(!video){
            return res.status(404).json({error:"video not found"});
        }

        await cloudinary.uploader.destroy(video.cloudinaryPublicId,{resource_type:'video',invalidate:true});
        res.json({message:"video deleted successfully"});
    } catch(error){
        console.error("Error deleting video",error);
        res.status(500).json({error:"Failed to delete video"});
    }
}

module.exports = {generateUploadSignature,saveVideoMetadata,deleteVideo};