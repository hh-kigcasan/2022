class Form_Validator{
    constructor(){
        this.errors = [];
    }
     /* 
        DOCU: The required function check if the string is empty or null.
    */
    required(string, name){
        if(string === null || string == ""){
            this.errors.push(`<p>${name} is required</p>`);  
        }
    }
    /* 
        DOCU: The validate_email function check if the email is valid.
    */
    validate_email(email){
        if((email.indexOf('@') < 1) || (email.indexOf('.') < email.indexOf('@') + 2) || (email.indexOf('.') === email.length - 1)){
            this.errors.push(`<p>Email is invalid</p>`);  
        }
    }
    /* 
        DOCU: The min_length function set the minimum length of the password.
    */
    min_length(password, min_length){
        if(password.length < min_length){
            this.errors.push(`<p>Password minimum length should be ${min_length}</p>`);
        }

    }
    /* 
        DOCU: The min_length function set the maximum length of the password.
    */
    max_length(password, max_length){
        if(password.length > max_length){
            this.errors.push(`<p>Password maximum length should be ${max_length}</p>`);
        }
    }
    /* 
        DOCU: The match function check if the password and confirmation password match.
    */
    match(password, confirmation_password){
        if(password !== confirmation_password){
            this.errors.push(`<p>Password does not match</p>`);
        }
    }
    /* 
        DOCU: The alpha function checks if the string has special characters.
    */
    alpha(string, name){
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~/\d/]/;
        if(specialChars.test(string)){
            this.errors.push(`<p>${name} is invalid</p>`);  
        };
    }
    /* 
        DOCU: The validation_errors function loop through the errors array and returns the errors.
    */
    validation_errors(){
        let hold = "";
        for(let error of this.errors){
            hold += error;
        }
        this.errors = [];
        return hold;
    }
    /* 
        DOCU: The has_errors function checks the error array if it has a value and returns true if it does not have an error.
    */
    has_errors(){
        if(this.errors.length == 0){
            return true;
        }
        else{
            return false;
        }
    }
}

module.exports = new Form_Validator;