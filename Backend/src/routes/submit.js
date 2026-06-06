const express = require('express');
const submitRouter = express.Router();
const userMiddleware = require('../middlewares/userMiddlewares');
const {submitCode,runCode,} = require('../controllers/usersubmission');



submitRouter.post("/submit/:id",userMiddleware,submitCode);
submitRouter.post("/run/:id",userMiddleware,runCode);


module.exports = submitRouter;