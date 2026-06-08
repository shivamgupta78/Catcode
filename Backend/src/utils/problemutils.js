const axios = require('axios');

const getLanguagebyId = (lang) =>{
    const language = {
        "c++": 54,
        "java": 62,
        "python": 71,
        "javascript": 63,

    }
    return language[lang.toLowerCase()];
}


module.exports = { getLanguagebyId };