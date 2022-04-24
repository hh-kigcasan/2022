const crypto = require('crypto');
const xssFilters = require('xss-filters');
const MainModel = require('../../system/MainModel');
const fv = require('../../system/FormValidation');

class SessionReplay extends MainModel
{
    // // get the student details/information by ID.
    // async getStudentByID(id, profiler = null)
    // {
    //     id = xssFilters.inHTMLData(id);
    //     return await this.executeQuery('SELECT * FROM students WHERE id = ?', [id], profiler, true);
    // }

    // // get the student details/information by email.
    // async getStudentByEmail(email, profiler = null)
    // {
    //     email = xssFilters.inHTMLData(email);
    //     return await this.executeQuery('SELECT * FROM students WHERE email = ?', [email], profiler, true);
    // }

    // // Filter the data using xssFilters and then add student info to the database
    // async addStudent(data, profiler = null)
    // {
    //     // sanitize all user inputs
    //     for (let key in data)
    //     {
    //         data[key] = xssFilters.inHTMLData(data[key]);
    //     }

    //     // escape characters then hash the password.
    //     let password = encodeURI(data.password);
    //     let salt = crypto.createHash('md5').update(data.email).digest('hex');
    //     let encryptedPassword = crypto.createHash('md5').update(password + salt).digest('hex');

    //     let query = `INSERT INTO students (first_name, last_name, email, password, salt, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
    //     let value = [data.first_name, data.last_name, data.email, encryptedPassword, salt];

    //     // return the ID if success, otherwise, log the error.
    //     try
    //     {
    //         return await this.executeQuery(query, value, profiler);
    //     }
    //     catch(err)
    //     {
    //         console.log(err);
    //     }   
    // }

    // // validate user inputs on registration
    // async validateInputRegistration(data, profiler = null)
    // {
    //     // sanitize all user inputs
    //     for (let key in data)
    //     {
    //         data[key] = xssFilters.inHTMLData(data[key]);
    //     }

    //     // validate the data
    //     fv.multipleValidation('First Name', data.first_name, [fv.isNotEmpty.bind(fv)], [fv.isAlpha.bind(fv)], [fv.isMinCharacters.bind(fv), 2]);
    //     fv.multipleValidation('Last Name', data.last_name, [fv.isNotEmpty.bind(fv)], [fv.isAlpha.bind(fv)], [fv.isMinCharacters.bind(fv), 2]);

    //     if (fv.multipleValidation('Email Address', data.email, [fv.isNotEmpty.bind(fv)], [fv.isValidEmail.bind(fv)]) && (await this.getStudentByEmail(data.email, profiler)))
    //     {
    //         fv.errors.push(`Email address already used. `);
    //     }

    //     fv.multipleValidation('Password', data.password, [fv.isNotEmpty.bind(fv)], [fv.isMinCharacters.bind(fv), 8]);
    //     fv.multipleValidation('Confirm Password', data.confirm_password, [fv.isNotEmpty.bind(fv)], [fv.isMatch.bind(fv), data.password]);

    //     // return the result of validation
    //     if (fv.errors.length)
    //     {
    //         let errors = fv.consolidateErrors('<span>', '</span>');
    //         fv.errors = [];
    //         return errors;
    //     }

    //     return 'Valid';        
    // }
}

module.exports = new SessionReplay();