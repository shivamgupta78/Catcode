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

const submitBatch = async (submissions) => {

    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        base64_encoded: 'true',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': '5214158e1fmshafa12e60c2af3aap1e7169jsnf6cef2cea645',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data: {
        submissions : submissions
        
    }
    };

async function fetchData() {
	try {
		const response = await axios.request(options);
	   return response.data;
	} catch (error) {
    if (error.response) {
        console.log("Error Data:", error.response.data);
    }
    }
 return await fetchData();

}
}
// problemutils.js mein waiting function badlein
const waiting = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const submitToken = async (resultToken) => {
const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(','), 
    base64_encoded: 'true',
    // wait: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '5214158e1fmshafa12e60c2af3aap1e7169jsnf6cef2cea645',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		 return response.data;
	} catch (error) {
		return (error);
	}
    }
    while(true){
    const result = await fetchData();
    const isResultObtained = result.submissions.every((r)=>{
    return r.status_id > 2
    })

    if(isResultObtained){
        return result.submissions;
    } 
    waiting(1000);
    }
    }

module.exports = { getLanguagebyId, submitBatch, submitToken };