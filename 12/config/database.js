// Database config
const { Client } = require("pg");
const fs = require("fs");
const YAML = require("js-yaml");

// Read the YAML File
const YAMLConfig = fs.readFileSync(__dirname + "/database_config.yaml");
const data = YAML.load(YAMLConfig);

class Config {
    constructor(host, user, password, database, port){
        this.Connection = new Client({
            host: host,
            user: user,
            port: port,
            password: password,
            database: database
        })
    }

    connect(){
        this.Connection.connect((err) => {
            if(err) throw err;
            console.log("Connected to database.");
        });
    }
}

module.exports = new Config(
    data.database.DB_host, 
    data.database.DB_user, 
    data.database.DB_password, 
    data.database.DB_name,
    data.database.DB_port
);