class Validation {
	constructor() {
		this.errors = [];
		this.validationError = false;
	}

	/**
	 * DOCU: Checking if the input email is a valid email address.
	 */
	isEmail(email) {
		const emailRegexp =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		if (!emailRegexp.test(email)) {
			this.validationError = true;
			this.errors.push("Invalid Email");
		}
	}

	/**
	 * DOCU: Validation if the input has a value
	 */
	isRequired(name, input) {
		if (!input) {
			this.validationError = true;
			this.errors.push(`${name} is required`);
		}
	}

	/**
	 * DOCU: Validation if the passwords are matched.
	 */
	isMatched(password1, password2) {
		if (password1 != password2) {
			this.validationError = true;
			this.errors.push("Password and Confirm Password not matched.");
		}
	}

	/**
	 * DOCU: Validation if the input has a value
	 */
	minLength(input, length) {
		if (input.length < length) {
			console.log(input.length);
			this.validationError = true;
			this.errors.push(`Password minimum length should be ${length}`);
		}
	}

	/**
	 * DOCU: Validation if the input is a number
	 */
	isNumeric(input, number) {
		if (!Number.isInteger(number)) {
			this.validationError = true;
			this.errors.push(`${input} must be a number`);
		}
	}
}

module.exports = new Validation();
