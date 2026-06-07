const express = require('express');
const app = express();
const main = require('./config/db.js');
const cookiesparser = require('cookie-parser');
require('dotenv').config();
const authRouter = require('./routes/userAuth.js');
const problemRouter = require('./routes/problemSet.js');
const redisClient = require('./config/redis.js');
const submitRouter = require('./routes/submit.js')
const videoRouter = require('./routes/videoCreator.js')
const cors = require('cors');

aapp.use(cors({
    origin: ['https://catcode-app.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(cookiesparser());



app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use("/submission", submitRouter);
app.use("/video",videoRouter);


const initializeConnection = async () =>{
    try{
        await Promise.all([main(), redisClient.connect()]);
        console.log("Connected to Redis and db connected");
         app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
    }
    catch(err){
        console.log("Error connecting to database or Redis");
    }
}

initializeConnection();