const {Client} = require('pg');
const Config = require('../config/config');

class Postgres_Database{
	constructor(){
		const credentials = Config.get_postgres_credentials();
		this.client = new Client(credentials);
		this.client.connect();
	}
	/* 
        DOCU: The execute_query function runs the query.
    */
	async execute_query(query, values){
		try{
			const res = await this.client.query(query, values);
			return res.rows;
		} 
        catch (err){
			return err.stack;
		}
	}
}

module.exports = new Postgres_Database();
