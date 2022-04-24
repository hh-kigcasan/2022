const candidateModel = require("../models/candidate");

class Dashboard {
	async index(req, res) {
		const presidential_candidates =
			await candidateModel.getAllCandidatesByPosition("president");
		const vicepresidential_candidates =
			await candidateModel.getAllCandidatesByPosition("vice president");
		const senatorial_candidates =
			await candidateModel.getAllCandidatesByPosition("senator");
		res.render("dashboard/user_dashboard", {
			presidents: presidential_candidates,
			vice_presidents: vicepresidential_candidates,
			senators: senatorial_candidates,
			user: req.session.user,
		});
	}

	async admin(req, res) {
		res.render("dashboard/admin/admin_dashboard");
	}

	async candidates(req, res) {
		const presidential_candidates =
			await candidateModel.getAllCandidatesByPosition("president");
		const vicepresidential_candidates =
			await candidateModel.getAllCandidatesByPosition("vice president");
		const senatorial_candidates =
			await candidateModel.getAllCandidatesByPosition("senator");
		res.render("dashboard/admin/candidates", {
			presidents: presidential_candidates,
			vice_presidents: vicepresidential_candidates,
			senators: senatorial_candidates,
		});
	}

	async add(req, res) {
		let data = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			political_party: req.body.political_party,
			position: req.body.position,
			image: req.file.filename,
		};

		let result = await candidateModel.validateAddingCandidate(data);
		if (result != "valid") {
			req.flash("error", result);
		} else {
			req.flash("success", "Candidate Added");
			await candidateModel.add_candidate(data);
		}
		res.redirect("/dashboard/candidates");
	}

	async update(req, res) {
		let id = req.params.id;
		let data = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			political_party: req.body.political_party,
			position: req.body.position,
			image: req.file.filename,
		};
		let result = await candidateModel.validateAddingCandidate(data);
		if (result != "valid") {
			req.flash("error", result);
		} else {
			req.flash("success", "Candidate Added");
			await candidateModel.update_candidate(id, data);
		}
		res.redirect("/dashboard/candidates");
	}

	async delete(req, res) {
		let id = req.params.id;
		await candidateModel.delete_candidate(id);
		res.redirect("/dashboard/candidates");
	}

	async vote(req, res) {
		const io = req.app.get("socketio");
		let id = req.params.id;
		let garnered_vote = req.body.vote;
		const candidate = await candidateModel.updateVoteByCandidate(
			id,
			garnered_vote
		);

		if (candidate) {
			let data = {
				id: candidate._id,
				garnered_votes: candidate.votes_gain,
			};

			io.on("connection", (socket) => {
				io.emit("vote", {
					data: data,
				});
				// socket.on("vote", () => {
				// 	io.emit("vote", {
				// 		data: data,
				// 	});
				// });
			});
			res.redirect("/dashboard");
		}
	}
}

module.exports = new Dashboard();
