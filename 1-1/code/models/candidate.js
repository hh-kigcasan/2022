const CandidateSchema = require("./candidateSchema");
const validation = require("../lib/validation");

class Candidate {
	/**
	 * DOCU: Insert post data to create a candidate
	 */
	async getAllCandidatesByPosition(position) {
		try {
			const candidates = await CandidateSchema.find({})
				.where("position")
				.equals(position);
			return candidates;
		} catch (err) {
			console.log(err.message);
		}
	}

	/**
	 * DOCU: Insert post data to create a candidate
	 */
	async add_candidate(post) {
		const { first_name, last_name, political_party, position, image } =
			post;
		try {
			const candidate = await CandidateSchema.create({
				first_name: first_name,
				last_name: last_name,
				political_party: political_party,
				position: position,
				image: image,
			});
			return candidate;
		} catch (err) {
			console.log(err.message);
		}
	}

	async update_candidate(id, post) {
		const { first_name, last_name, political_party, position, image } =
			post;
		try {
			const candidate = await CandidateSchema.findByIdAndUpdate(id, {
				first_name: first_name,
				last_name: last_name,
				political_party: political_party,
				position: position,
				image: image,
			});
			return candidate;
		} catch (err) {
			console.log(err.message);
		}
	}

	async updateVoteByCandidate(id, vote) {
		try {
			const candidate = await CandidateSchema.findByIdAndUpdate(
				id,
				{
					$inc: { votes_gain: vote },
				},
				{ new: true }
			);
			return candidate;
		} catch (err) {
			console.log(err.message);
		}
	}

	async delete_candidate(id) {
		try {
			const candidate = await CandidateSchema.findByIdAndDelete(id, {});
			return candidate;
		} catch (err) {
			console.log(err.message);
		}
	}

	/**
	 * DOCU: Validation for adding a candidate
	 */
	async validateAddingCandidate(post) {
		const { first_name, last_name, political_party, position, image } =
			post;
		validation.isRequired("First Name", first_name);
		validation.isRequired("Last Name", last_name);
		validation.isRequired("Political Party", political_party);
		validation.isRequired("Position", position);
		validation.isRequired("Image", image);
		if (validation.validationError) {
			return validation.errors;
		} else {
			return "valid";
		}
	}
}

module.exports = new Candidate();
