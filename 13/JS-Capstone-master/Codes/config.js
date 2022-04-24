const YAML = require("js-yaml");
const Mysql = require("mysql");
const fs = require("fs");
const port = 1722;
const { Client } = require("pg");
let client;
//LOADS THE YAML
const yaml_data = fs.readFileSync("data.yaml");
const data = YAML.load(yaml_data); // .load is now much safer than safeLoad

if(data.database == "postgres") {
    client = new Client({
        host: data.postgres.host,
        user: data.postgres.user,
        port: data.postgres.port,
        password: data.postgres.password,
        database: data.postgres.database
    });
}
else if(data.database == "sql") {
    client = Mysql.createConnection({
        host: data.sql.host,
        user: data.sql.user,
        port: data.sql.port,
        password: data.sql.password,
        database: data.sql.database
    });
}

module.exports = {connect: client, port: port};