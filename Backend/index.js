const express = require('express');
const app = express();
const main = require('./src/config/db.js'); 
const cookiesparser = require('cookie-parser');
require('dotenv').config();
const authRouter = require('./src/routes/userAuth.js');
const problemRouter = require('./src/routes/problemSet.js');
const redisClient = require('./src/config/redis.js');
const submitRouter = require('./src/routes/submit.js');
const videoRouter = require('./src/routes/videoCreator.js');
const cors = require('cors');

app.use(cors({
    origin: "https://catcode-app.vercel.app", 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(cookiesparser());

app.use(async (req, res, next) => {
    await initializeConnection();
    next();
});

const initializeConnection = async () => {
    try {
        if (!redisClient.isOpen) {
            await Promise.all([main(), redisClient.connect()]);
            console.log("Connected to Redis and db connected");
        }
    }
    catch(err) {
        console.log("Error connecting to database or Redis:", err.message);
    }
}



app.get('/', (req, res) => {
    res.status(200).json({
        message: "Catcode Backend Server Is Running Successfully!",
        status: "Active"
    });
});
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use("/submission", submitRouter);
app.use("/video", videoRouter);

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;