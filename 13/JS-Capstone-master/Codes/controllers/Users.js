//REQUIRES
const User = require("../models/User"); //requires the User model.

//GLOBAL VARIABLES
let error_success_msg = [];
let msg_type;

//START OF CLASS
class Users {
    /* DOCU: This method is to check if the session sess_id is set, if set it will redirect the user to the dashboard page, if not, it will render the login ejs file.
        OWNER: Judy Mae
    */
    index(req, res) {
        if(!req.session.sess_id) {
            res.render("User_View/login", {
                page_title: "Login Page",
                msg: {type: msg_type, message: error_success_msg},
                sess_id: req.session.sess_id,
                token: req.csrfToken()
            });
            error_success_msg = [];
        }
        else {
            res.redirect("/dashboard");
        }
    }

    /* DOCU: This method is to check if the session sess_id is set, if set it will redirect the user to the dashboard page, if not, it will render the register ejs file.
        OWNER: Judy Mae
    */
    register(req, res) {
        req.session.body_post = null; //to remove past data of body post
        req.session.query = null; //to remove session query.

        if(!req.session.sess_id) {
            res.render("User_View/register", {
                page_title: "Register Page",
                msg: {type: msg_type, message: error_success_msg},
                sess_id: req.session.sess_id,
                token: req.csrfToken()
            });
            error_success_msg = [];
        }
        else {
            res.redirect("/dashboard");
        }
    }

    /* DOCU: This method is to process the login details of user, if email and password is correct it will redirect the user to the dashboard.
        OWNER: Judy Mae
    */
    async process_login(req, res) {
        req.session.body_post = req.body;
        let validate = User.validate_login(req.body);
        if(validate !== "valid") {
            msg_type = "error";
            error_success_msg = validate;
        }
        else {
            try {
                let email_exist = await User.check_if_exist(req.body);
                req.session.query = email_exist.query;
                if(email_exist.isExist == false) {
                    msg_type = "error";
                    error_success_msg = email_exist.msg;
                }
                else {
                    req.session.sess_id = email_exist.sess_id;
                }
            }
            catch(errors) {
                console.log(errors);
            }
        }
        res.redirect("/");
    }

    /* DOCU: This method is to process the registration of user, before adding it to the database it will pass the form fields to the model to validate it. If it is valid it will again go to the model and use the add_user method to add the user to our users table in the database. If there are errors, it will redirect to /register which will render the view page showing the errors, if user is able to successfully register, it will redirect to the login page.
        OWNER: Judy Mae
    */
    async process_register(req, res) {
        req.session.body_post = req.body;
        try {
            let validate = await User.validate_register(req.body);
            if(validate !== "valid") {
                msg_type = "error";
                error_success_msg = validate;
            }
            else {
                try {
                    let new_user = await User.add_user(req.body);
                    req.session.query = new_user.query;
                    msg_type = "success";
                    error_success_msg = ["Successfully Registered!"];
                }
                catch(error) {
                    msg_type = "error";
                    error_success_msg = [error];
                }
            }
        }
        catch(errors) {
            console.log(errors);
        }
        res.redirect("/register");
    }
}
//END OF CLASS

//INSTANTIATION OF CLASS
let new_user = new Users();

//EXPORT IT AS MODULE
module.exports = new_user;