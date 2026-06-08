const { compile } = require('tailwindcss');
const Submission = require('../models/submission');
const User = require('../models/user.js');
const problem = require('../models/problem')



const submitCode = async (req,res)=>{
    try{
        const userId = req.result._id;
        const problemId = req.params.id;
        const {code , language} = req.body;
        if(!userId || !code || !language || !problemId)
            return res.status(400).json({message:"some field missing"});

        const problems = await problem.findById(problemId)
   
        const testResult = (problems.visibleTestCases || []).map((testcase)=>{
            const randomTime = (Math.random() * 0.14 + 0.01).toFixed(3);
            const randomMemory = Math.floor(Math.random()*3075) + 1024;
            const isSuccess = Math.random() < 0.7
             return {
                status_id : isSuccess ? 3  : 4,
                status : {
                    id:isSuccess ? 3 : 4,
                    description:isSuccess ? "Accepted" : "wrong Answer"
                },
                time : randomTime,
                memory : randomMemory,
                stdout:isSuccess ? "Success" : null,
                stderr:isSuccess ? null : "Wrong Answer: output Mismatch",
                compile_output:null,
                message:null
            }
  
    });
    const hiddencount = problems.hiddenTestCases?.length || 0;
        const totalTestCases = testResult.length + hiddencount 
        const passedCount = testResult.filter(test => test.status_id == 3).length + hiddencount;
        const totalRuntime = testResult.reduce((sum,test)=>sum + parseFloat(test.time), 0).toFixed(3);
        const maxMemory = testResult.reduce((max,test)=>Math.max(max, test.memory), 0);
        const status = passedCount === totalTestCases ? "accepted" : "failed";

        //checking problemId to the userSchema's problemSolved if it is not present there.
       if (status === "accepted") {
            // Sirf tabhi push karo jab vo pehle se array mein na ho
            if (!req.result.problemsSolved.includes(problemId)) {
                req.result.problemsSolved.push(problemId);
                await req.result.save();
            }
        }
             const submittedResult = await Submission.create({
                userId,
                problemId,
                code:code,
                language:language,
                testCasesTotal : totalTestCases,
                testCasesPassed:passedCount,
                runtime:totalRuntime,
                memory:maxMemory,
                status:status,
            })
            const response = {
                submissionId:submittedResult._id,
                status,
                totalTestCases,
                passedCount,
                totalRuntime,
                maxMemory,
                
            }
            res.status(201).json(response)


    }catch(err){
        console.error("error in submit code backend", err)
        res.status(500).json({message:"internal server error", err: err.message});
    }
    

}


const runCode = async (req,res)=>{
    try{
        const userId = req.result._id;
        const problemId = req.params.id;
        const {code , language} = req.body;
        if(!userId || !code || !language || !problemId)
            return res.status(400).json({message:"some field missing"});

        //fetching the test cases of problem
        const problems = await problem.findById(problemId)
        if(!problems){
            return res.status(400).json({message:"problem not found"});
        }
        //creating mock function
        const testResult = (problems.visibleTestCases || []).map((testcase)=>{
            const randomTime = (Math.random() * 0.14 + 0.01).toFixed(3);
            const randomMemory = Math.floor(Math.random()*3075) + 1024;
            const isSuccess = Math.random() < 0.7
            
            return {
                status_id : isSuccess ? 3  : 4,
                status : {
                    id:isSuccess ? 3 : 4,
                    description:isSuccess ? "Accepted" : "wrong Answer"
                },
                time : randomTime,
                memory : randomMemory,
                stdout:isSuccess ? "Success" : null,
                stderr:isSuccess ? null : "Wrong Answer: output Mismatch",
                compile_output:null,
                message:null
            }
        });
        const totalTestCases = testResult.length;
        const passedCount = testResult.filter(test => test.status_id == 3).length;
        const totalRuntime = testResult.reduce((sum,test)=>sum + parseFloat(test.time), 0).toFixed(3);
        const maxMemory = testResult.reduce((max,test)=>Math.max(max, test.memory), 0);

        const finalResponse = {
            status:passedCount === totalTestCases ? "accepted" : "failed",
            totalTestCases,
            passedCount,
            totalRuntime,
            maxMemory,
            testCases:testResult
        }
         res.status(201).json(finalResponse);



    }catch(err){
        console.log("error in runCode:", err);
        res.status(500).json({message:"internal server error", err: err.message});
    }


}





module.exports = {submitCode,runCode}