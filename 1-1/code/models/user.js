const bcrypt = require("bcrypt");
const UserSchema = require("./userSchema");
const validation = require("../lib/validation");

class User {
	/**
	 * DOCU: Insert post data to register a user.
	 */
	async register(post) {
		const { first_name, last_name, email, password, province } = post;
		const hashedPassword = await bcrypt.hash(password, 10);
		try {
			const user = await UserSchema.create({
				first_name: first_name,
				last_name: last_name,
				email: email,
				password: hashedPassword,
				province: province,
			});

			return user;
		} catch (err) {
			console.log(err.message);
		}
	}

	/**
	 * DOCU: Checking if the user's email exist.
	 */
	async checkUserByEmail(email) {
		const user = await UserSchema.findOne({ email });
		return user;
	}

	/**
	 * DOCU: Validation for register function
	 */
	async validateRegistration(post) {
		validation.isEmail(post.email);
		validation.isRequired("Email", post.email);
		validation.isRequired("First Name", post.first_name);
		validation.isRequired("Last Name", post.last_name);
		validation.isRequired("Password", post.password);
		validation.isRequired("Province", post.province);
		validation.isMatched(post.password, post.confirm_password);
		validation.minLength(post.password, 8);
		if (validation.validationError) {
			return validation.errors;
		} else if (await this.checkUserByEmail(post.email)) {
			return "Email already taken";
		} else {
			return "valid";
		}
	}

	/**
	 * DOCU: Checking if the user exist then check users credentials to login the app.
	 */
	async login(post) {
		const { email, password } = post;
		const user = await this.checkUserByEmail(email);
		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				return user;
			} else {
				return false;
			}
		}
	}

	/**
	 * DOCU: Validation for login function
	 */
	validateLogin(post) {
		validation.isEmail(post.email);
		validation.isRequired("Email", post.email);
		validation.isRequired("Password", post.password);
		if (validation.validationError) {
			return validation.errors;
		} else {
			return "valid";
		}
	}
}

module.exports = new User();
