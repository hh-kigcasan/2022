//REQUIRES
const DB = require("./Db"); //this requires the Db model.
const Mysql = require("mysql");
const md5 = require("md5");
const crypto = require("crypto-js");
const Validate = require("../assets/libraries/validation"); //this requires the validation library.

//START OF CLASS
class User extends DB {
    /* DOCU: This method is to add the information of new user in the database.
        OWNER: Judy Mae
    */
    async add_user(form_data) {
        let salt = md5(form_data.password);
        let encrypted = crypto.AES.encrypt(form_data.password, salt).toString();

        let query = Mysql.format(`INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)`, [
            form_data.first_name,
            form_data.last_name,
            form_data.email,
            encrypted,
            salt,
        ]);
        let run = this.run_query(query);
        return run;
    }

    /* DOCU: This method gets all the users in the database
        OWNER: Judy Mae
    */
    get_all_users() {
        let run = this.run_query(Mysql.format(`SELECT * FROM users`));
        return run;
    }

    get_other_users(user_id) {
        let run = this.run_query(Mysql.format(`SELECT * FROM users WHERE id != ?`, [user_id]));
        return run;
    }

    /* DOCU: This method gets the data of a user which has the same email as the parameter.
        OWNER: Judy Mae
    */
    get_by_email(user_email) {
        let query = Mysql.format(`SELECT * FROM users WHERE email = ?`, [user_email]);
        let run = this.run_query(query);
        return run;
    }

     /* DOCU: This method gets the data of a user which has the same id as the parameter.
        OWNER: Judy Mae
    */
    get_by_id(user_id) {
        let query = Mysql.format(`SELECT * FROM users WHERE id = ?`, [user_id]);
        let run = this.run_query(query);
        return run;
    }

    /* DOCU: This method is to check if the login password matches the encrypted password in the database.
        OWNER: Judy Mae
    */
    password_match(form_pass, db_pass) {
        let salt = md5(form_pass);
        let pass_decrypt = crypto.AES.decrypt(db_pass, salt);
        let decrypted = pass_decrypt.toString(crypto.enc.Utf8)
        if(decrypted == form_pass) {
            return "match";
        }
        else if(decrypted !== form_pass){
            return "Password is incorrect.";
        }
    }
    /* DOCU: This method is to validate the fields in the registration form. It will check if it is empty, if it passes the required minimum length and if the email is unique and/or not yet in the database. If validation is valid, it will return valid, if not it will return all the errors back to the controller.
        OWNER: Judy Mae
    */
    async validate_register(form_data) {
        let get_error;
        let db_email;
        try {
            let check_email = await this.get_by_email(form_data.email);
            for(let i = 0; i < check_email.rows.length; i++) {
                db_email = check_email.rows[i].email;
            }
        }
        catch(errors) {
            console.log(errors);
        }
        get_error = {
            empty: Validate.isEmpty(form_data),
            minLength: Validate.minLength(form_data),
            validEmail: Validate.validEmail(form_data.email),
            unique: Validate.uniqueEmail(form_data.email, db_email),
            passwordMatch: Validate.passMatch(form_data.password, form_data.confirm_password)
        };
        let cnt = 0;
        for(let keys in get_error) {
            if(get_error[keys].length == 0) {
                cnt++;
            }
            else {
                if(cnt < Object.keys(get_error).length) {
                    return get_error[keys];
                }
            }
        }
        if(cnt == Object.keys(get_error).length) {
            return "valid";
        }
    }

    /* DOCU: This method is to validate the fields in the login form. It will check if it is empty, if it passes the required minimum length and if the email is valid. If validation is valid, it will return valid, if not it will return all the errors back to the controller.
        OWNER: Judy Mae
    */
    validate_login(form_data) {
        let get_error;
        get_error = {
            empty: Validate.isEmpty(form_data),
            minLength: Validate.minLength(form_data),
            validEmail: Validate.validEmail(form_data.email),
        };
        let cnt = 0;
        for(let keys in get_error) {
            if(get_error[keys].length == 0) {
                cnt++;
            }
            else {
                if(cnt < Object.keys(get_error).length) {
                    return get_error[keys];
                }
            }
        }
        if(cnt == Object.keys(get_error).length) {
            return "valid";
        }
    }

    /* DOCU: This method is to check if email is existing.
        OWNER: Judy Mae
    */
    async check_if_exist(form_data) {
        let session_id;
        try {
            let get_result = await this.get_by_email(form_data.email);
            if(get_result.rows.length == 0) {
                return {isExist: false, msg: ["You are not yet registered."]};
            }
            else {
                let db_pass;
                for(let i = 0; i < get_result.rows.length; i++) {
                    db_pass = get_result.rows[i].password;
                    session_id = get_result.rows[i].id;
                }
                let decrypt_pass = this.password_match(form_data.password, db_pass);
                if(decrypt_pass === "match") {
                    return {isExist: true, sess_id: session_id, query: get_result.query};
                }
                else {
                    return {isExist: false, msg: [decrypt_pass], query: get_result.query};
                }
            }
        }
        catch(errors) {
            console.log(errors);
        }
    }
}
//END OF CLASS

//INSTANTIATION
let user_model = new User();

//EXPORT IT AS MODULE
module.exports = user_model;