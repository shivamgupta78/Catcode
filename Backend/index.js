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

const allowedOrigins = [
  'https://catcode-app.vercel.app',
  'https://catcode-dev.vercel.app' 
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());
app.use(cookiesparser());

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use("/submission", submitRouter);
app.use("/video", videoRouter);

const initializeConnection = async () => {
    try {
        if (!redisClient.isOpen) {
            await Promise.all([main(), redisClient.connect()]);
            console.log("Connected to Redis and DB successfully");
        }
    } catch (err) {
        console.log("Error connecting to database or Redis:", err.message);
    }
};

app.use(async (req, res, next) => {
    await initializeConnection();
    next();
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running locally on port ${PORT}`);
    });
}

module.exports = app; 