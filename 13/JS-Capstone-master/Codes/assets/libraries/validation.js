class Validation {
    /* DOCU: This method is to check if the fields are empty.
        OWNER: Judy Mae
    */
    isEmpty(fields) {
        let errors = [];
        for(let keys in fields) {
            if(fields[keys].length == 0) {
                errors.push("Please enter your " + keys + ".");
            }
        }
        return errors;
    }

    /* DOCU: This method is to check if the value of the field is a number. If it is not a number it would return an error.
        OWNER: Judy Mae
    */
    isNumber(label, field) {
        let errors = [];
        if(isNaN(parseInt(field)) == true) {
            errors.push(label + " should be a number.");
        }
        return errors;
    }

    /* DOCU: This method is to check if the value of the field has the required minimum length.
        OWNER: Judy Mae
    */
    minLength(fields) {
        let errors = [];
        for(let keys in fields) {
            if(keys.includes("password") == true || keys.includes("Password") == true) {
                if(fields[keys].length < 8) { //8 here is the minimum length required for a password.
                    errors.push(keys + " must be at least 8 characters long.");
                }
            }
            else if(keys.includes("name") == true || keys.includes("Name") == true) {
                if(fields[keys].length < 2) { //2 here is the minimum length required for a name.
                    errors.push(keys + " must be at least 2 characters long.");
                }
            }
        }
        return errors;  
    }

    /* DOCU: This method is to check if the value of the field has the required maximum length.
        OWNER: Judy Mae
    */
    maxLength(field, length) {

    }

    /* DOCU: This method is to check if the value of the email field is valid.
        OWNER: Judy Mae
    */
    validEmail(email) {
        let errors = [];
        if(email.includes("@") == true) {
            let char_index = email.indexOf("@");
            if(email.includes(".com", char_index) == false) {
                errors.push("Please enter a valid email address.");
            }
        }
        else if(email.includes("@") == false) {
            errors.push("Please enter a valid email address.");
        }
        return errors;
    }

    uniqueEmail(form_email, db_email) {
        let errors = [];
        if(form_email == db_email) {
            errors.push("Email already exists!");
        }
        return errors;
    }

    passMatch(password, confirm_password) {
        let errors = [];
        if(password !== confirm_password) {
            errors.push("Confirm password does not match password.");
        }
        return errors;
    }
}

let validate = new Validation();
module.exports = validate;