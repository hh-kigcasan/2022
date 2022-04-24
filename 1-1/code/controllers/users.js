const userModel = require("../models/user");
const candidateModel = require("../models/candidate");

class Users {
	/*  This function is to redirect index page to login page
		Owner: Alfie
    */
	async index(req, res) {
		const presidential_candidates =
			await candidateModel.getAllCandidatesByPosition("president");
		const vicepresidential_candidates =
			await candidateModel.getAllCandidatesByPosition("vice president");
		const senatorial_candidates =
			await candidateModel.getAllCandidatesByPosition("senator");
		res.render("dashboard/dashboard", {
			presidents: presidential_candidates,
			vice_presidents: vicepresidential_candidates,
			senators: senatorial_candidates,
		});
	}
	/*  This function is to display to login page
		Owner: Alfie
	*/
	login(req, res) {
		res.render("users/login");
	}
	/*  This function is to display to edit profile page
		Owner: Alfie
	*/
	async editProfile(req, res) {
		let id = req.session.userId;
		const user = await userModel.getUserById(id);
		res.render("users/profile", { profile: user[0] });
	}
	/*  This function is to process the profile update
		Owner: Alfie
	*/
	async edit(req, res) {
		let id = req.body.id;
		let result = userModel.validateProfile(req.body);
		if (result === "valid") {
			await userModel.updateProfile(id, req.body);
		} else {
			console.log("error");
		}
		res.redirect(`/users/edit`);
	}
	/*  This function is to process the login
		Owner: Alfie
	*/
	async process_login(req, res) {
		let result = userModel.validateLogin(req.body);
		if (result === "valid") {
			const user = await userModel.login(req.body);
			if (user && user.user_level == "Admin") {
				let data = {
					id: user.id,
					first_name: user.first_name,
					last_name: user.last_name,
					email: user.email,
					user_level: user.user_level,
				};
				req.session.user = data;
				req.session.userId = user.id;
				res.redirect("/dashboard/admin");
			} else if (user) {
				let data = {
					id: user.id,
					first_name: user.first_name,
					last_name: user.last_name,
					email: user.email,
					province: user.province,
				};
				req.session.user = data;
				//console.log(req.session.userData);
				req.session.userId = user.id;
				res.redirect("/dashboard");
			} else {
				req.flash("error", "Invalid Credentials");
				res.redirect("/login");
			}
		}
	}
	/*  This function is to display to registration page
		Owner: Alfie
	*/
	register(req, res) {
		const messages = req.flash();
		res.render("users/register", { messages });
	}
	/*  This function is to process the registration of the user
	    Owner: Alfie
	*/
	async process_register(req, res) {
		let result = await userModel.validateRegistration(req.body);
		if (result != "valid") {
			req.flash("error", result);
		} else {
			req.flash("success", "User account registered successfully");
			await userModel.register(req.body);
		}
		res.redirect("/register");
	}
	async changePassword(req, res) {
		let id = req.body.id;
		let result = await userModel.validateChangePassword(id, req.body);
		if (result === "valid") {
			await userModel.updatePassword(id, req.body);
		} else {
			console.log(result);
		}
		res.redirect("/users/edit");
	}
	/*  This function is to logout the user and to destroy all the sessions
	    Owner: Alfie
	*/
	logoff(req, res) {
		req.session.destroy();
		res.redirect("/login");
	}
}

module.exports = new Users();
