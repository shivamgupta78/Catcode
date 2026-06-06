const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-17834.crce292.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 17834
    }
});



module.exports = redisClient;