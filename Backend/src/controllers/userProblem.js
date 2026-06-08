const Problem = require('../models/problem.js');
const {getLanguagebyId} = require('../utils/problemutils');
const User = require('../models/user.js');
const SolutionVideo = require("../models/solutionVideo.js");
const Submission = require("../models/submission.js")

// const createProblem = async (req, res) =>{
//     // console.log("request body", req.result._id);
//     const {title, description, difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator} = req.body;
//     try{
//         for(const {language, completeCode} of referenceSolution){
//             //submission format for judge0 api
//             const languageId = getLanguagebyId(language);
//             const submissions = visibleTestCases.map((testCase) =>({
//                 source_code: completeCode,
//                 language_id: languageId,
//                 stdin: testCase.input,
//                 expected_output: testCase.output,
//             }));        

//             // const submitResult = await submitBatch(submissions);
//             // console.log(typeof submitResult);
//             // console.log("submit result", submitResult);

//             // const resultToken = submitResult.map((value) => value.token);

//             // const testResult = await submitToken(resultToken);
//             // for(const test of testResult){
//             //     if(test.status.id !== 3){
//             //         return res.status(400).send("Error Occurrred"); 
//             //     }
//             //     if (test.status.id == 4){
//             //         return res.status(400).send("Reference solution failed for some test cases");
        
            
//         }

//             //save the problem to database
//             await Problem.create({
//                 ...req.body,
//                 problemCreator: req.result._id,
//             });
//             return res.status(201).send("Problem created successfully");
        

//     }catch(err){
//         res.status(500).send("Internal Server Error"+ err.message);
//     }
//  }
// --- MOCK JUDGE0 FUNCTIONS ---
// Simulates sending code to Judge0 and getting submission tokens

const mockSubmitBatch = async (submissions) => {
    console.log("Mocking Judge0: Submitting batch...");
    return submissions.map((_, index) => ({
        token: `mock_token_${Math.random().toString(36).substr(2, 9)}_${index}`
    }));
};

// Simulates checking the status of tokens on Judge0
const mockSubmitToken = async (tokens) => {
    console.log("Mocking Judge0: Checking token statuses...");
    // Simulate that all test cases passed successfully (status id 3 = Accepted)
    return tokens.map(() => ({
        status: { id: 3, description: "Accepted" }
    }));
};

const createProblem = async (req, res) => {
    try {
        const {
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution
        } = req.body;

        
        const problemCreator = req.result?._id;

        if (!problemCreator) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Problem creator ID not found."
            });
        }

        const newProblem = new Problem({
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution,
            problemCreator 
        });

        const savedProblem = await newProblem.save();

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem: savedProblem
        });

    } catch (error) {
        console.log("validation error details:", error.errors);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


 const updateproblem = async (req,res)=>{
    const {problemId} = req.params;
    const {title, description, difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator} = req.body;
    try{
        if(!problemId){
           return  res.status(400).json({message:"invalid id"});
        }
        const Dsaproblem = await Problem.findById(problemId)
        if(!Dsaproblem){
            return res.status(404).json({message:"ID is not present in server"})
        }

        const newProblem = await Problem.findByIdAndUpdate(problemId, {...req.body} , {runValidators:true, new:true},);

        res.status(200).json(newProblem);

    }catch(err){
        res.status(500).json({message :"Error", err: err.message});
    }
 }

const deleteProblem = async (req,res)=>{
    const { id } = req.params;
    try{
        if(!id){
            return res.status(400).json({message:"id is missing"});
        }
        const deletedProblem = await Problem.findByIdAndDelete(id);
        if(!deletedProblem){
            return res.status(404).json({message:"problem is missing"})
        }
            res.status(200).json({message:"Successfully Deleted"});
        
    }catch(err){
        res.status(500).json({message:"Error:", err: err.message});
    }
}

const getProblemById = async (req,res)=>{
    const { id } = req.params;
    try{
        if(!id){
            return res.status(400).json({message:"id is missing"});
        }
        const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode hiddenTestCases referenceSolution');
        if(!getProblem){
            return res.status(404).json({message:"problem is missing"})
        }
        const videos = await SolutionVideo.find({problemId:id});
        if(videos){
            getProblem.secureUrl= videos.secureUrl,
            getProblem.CloudinaryPublicId= videos.CloudinaryPublicId,
            getProblem.thumbnailUrl=videos.thumbnailUrl,
            getProblem.duration=videos.duration
            return res.status(200).send(getProblem);
        }
            res.status(200).json(getProblem);
        
    }catch(err){
        res.status(500).json({message:"Error:", err: err.message});
    }   
}

const problemFetchAll = async (req,res)=>{
    try{   
    const getProblem = await Problem.find({}).select('_id title difficulty tags');
        if(getProblem.length==0){
            return res.status(404).json({message:"problem is missing"})
        }
            res.status(200).json(getProblem);
        
    }catch(err){
        res.status(500).json({message:"Error:", err: err.message});
    }   
}

const solvedProblem = async (req,res)=>{
        try{
            const { problemId } = req.params;
            const userId = req.result._id;
            const userSubmission = await Submission.find({
                userId:userId,
            })
            .select("problemId status runtime memory language createdAt testCasesPassed testCasesTotal code")
            .sort({createdAt:-1});
            res.status(200).json(userSubmission || []);

        } catch(err){
            res.status(500).json({message:"server error", err:err.message});
        }
}





module.exports = { createProblem,updateproblem, deleteProblem,getProblemById,problemFetchAll,solvedProblem};