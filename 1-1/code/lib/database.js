const mongoose = require("mongoose");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("config.yaml"));

class Database {
	constructor() {
		this.connection = config.db;
	}

	async connectDB() {
		try {
			await mongoose.connect(this.connection, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
		} catch (err) {
			console.log(err.message);
		}
	}
}

module.exports = new Database();
