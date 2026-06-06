const mongoose = require('mongoose');
const { schema }  = mongoose;

async function main() {
    await mongoose.connect(process.env.DB_KEY);    
    console.log("Connected to database successfully");
}

module.exports = main;