//REQUIRES
const User = require("../models/User"); //requires the User model.
const { v4: uuidV4 } = require("uuid");
const { translate } = require("google-translate-api-browser");
const readline = require("readline");

//START OF CLASS
class Dashboards {

    /* DOCU: This method is to check if the session sess_id is set, if set it will render the dashboard page, if not, it will redirect the user to login page.
        OWNER: Judy Mae
    */
    dashboard(req, res) {
        res.locals.profile_details.post = req.session.body_post;
        res.locals.profile_details.query = req.session.query;
        req.session.body_post = null; //to remove past data of body post
        req.session.query = null; //to remove session query.
        
        if(!req.session.sess_id) {
            res.redirect("/");
        }
        else {
            res.render("Dashboard_View/dashboard", {
                page_title: "Dashboard Page",
                sess_id: req.session.sess_id
            });
        }
    }

    /* DOCU: This method is to check if the session sess_id is set, if set it will render the friend's page, if not, it will redirect the user to login page.
        OWNER: Judy Mae
    */
    async friends(req, res) {
        let get_users;
        try {
            get_users = await User.get_other_users(req.session.sess_id);
            req.session.query = get_users.query;
        }
        catch(errors) {
            console.log(errors);
        }

        if(!req.session.sess_id) {
            res.redirect("/");
        }
        else {
            res.render("Dashboard_View/friends", {
                page_title: "Friend's List Page",
                sess_id: req.session.sess_id,
                users: get_users.rows,
            });
        }
    }

    video(req, res) {
        res.redirect(`room/${uuidV4()}`);
    }

    async room(req, res) {
        req.session.query = null;
        let get_user;
        try {
            get_user = await User.get_by_id(req.session.sess_id);
        }
        catch(errors) {
            console.log(errors);
        }

        if(!req.session.sess_id) {
            res.redirect("/");
        }
        else {
            res.render("Dashboard_View/video-call", {
                page_title: "Room",
                sess_id: req.session.sess_id,
                user: get_user.rows[Object.keys(get_user.rows)[0]],
                roomId: req.params.room_id,
            });
        }
    }

    /* DOCU: This method is to logout the user by destroying the session. After, it will redirect the user to login page.
        OWNER: Judy Mae
    */
    logout(req, res) {
        req.session.destroy();
        res.redirect("/");
    }
}
//END OF CLASS

//INSTANTIATION
let new_dashboard = new Dashboards();

//EXPORT IT AS MODULE
module.exports = new_dashboard;
