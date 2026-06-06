const validator = require('validator');


const validate = (data) =>{
     const Mandatoryfields = ["firstName","email","password"];
     const isAllowed = Mandatoryfields.every((k) => Object.keys(data).includes(k));
        if(!isAllowed){
            throw new Error("Missing mandatory fields");
        } if(!validator.isEmail(data.email)){
            throw new Error("Invalid email format");
        } if(!validator.isStrongPassword(data.password)){
            throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
        }
}

module.exports = validate;