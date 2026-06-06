const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../middlewares/adminMiddleware');
const userMiddleware = require('../middlewares/userMiddlewares');
const {createProblem, updateproblem,deleteProblem,getProblemById,problemFetchAll,solvedProblem}  = require('../controllers/userProblem.js');


problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:problemId",adminMiddleware,updateproblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


problemRouter.get("/problemById/:id", userMiddleware, getProblemById);
problemRouter.get("/getAllProblem",userMiddleware, problemFetchAll);
problemRouter.get("/problemSolvedByUser/:problemId",userMiddleware,solvedProblem);


module.exports = problemRouter;

