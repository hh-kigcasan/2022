const validator= require('../static/lib/validator/validator');
const uniq = require('../static/lib/universal-query/universalQuery');
const crypto = require('crypto');
const md5 = require('md5');
const xssFilter = require('xss-filters');

/**
 * DOCU: Class Database
 */

class UserModel {
    /**
     * DOCU: Get User Input from Database
     * returns a promise
     */

    getUser(raw_email) {
        const email = xssFilter.inHTMLData(raw_email);
        return uniq.queryAll('SELECT * FROM users WHERE email = ?', [email]);
    }

    /**
     * DOCU: Add the user to Database and display error messages
     * returns undefined
     */

    addUser(req) {
        const first_name = xssFilter.inHTMLData(req.body.first_name);
        const last_name = xssFilter.inHTMLData(req.body.last_name);
        const email = xssFilter.inHTMLData(req.body.email);
        const pass = xssFilter.inHTMLData(req.body.password);
        const c_pass = xssFilter.inHTMLData(req.body.confirm_password);

        validator.setField('First Name', first_name).isAlpha().isLength({ min:3 });
        validator.setField('Last Name', last_name).isAlpha().isLength({ min:3 });
        validator.setField('Email', email).isEmail();
        validator.setField('Password', pass).isLength({ min:8 });
        validator.setField('Confirm Password', c_pass).isSame(pass);

        const bin2hex = crypto.randomBytes(16).toString('hex');
        const salt = md5(bin2hex);
        const password = md5(pass) + salt;
        const errors = validator.validationErrors();

        if(Object.keys(errors).length !== 0) { 
            req.session.errors = errors;
            return;
        }
        
        uniq.queryNone(
            `INSERT INTO users(first_name, last_name, email, password, salt, created_at, updated_at)
            VALUES(?, ?, ?, ?, ?, NOW(), NOW())`, 
            [first_name, last_name, email, password, salt]
        );

        req.session.errors['message'] = "User Registration Success!";
    }

    /**
     * DOCU: Validate user 
     * returns true or false
     */

    validateUser(req, user) {
        if(user[0] == undefined) {
            return false;
        }
        
        const pass = xssFilter.inHTMLData(req.body.password);
        const salt = user[0].salt;
        const password = md5(pass) + salt;

        if(password !== user[0].password) {
            return false;
        }

        req.session.user = user;
        return true;
    }
}

/**
 * DOCU: Export Database to controllers
 */

module.exports = new UserModel();
