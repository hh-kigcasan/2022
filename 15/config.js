const fs = require("fs");
const YAML = require("js-yaml");

const raw = fs.readFileSync("data.yaml");
const data = YAML.load(raw);
const Mysql = require("mysql");

// check if what database engine was set in yaml

if (data.DBEngine == "MySQL") {
  var db = Mysql.createConnection({
    host: data.host,
    user: data.user,
    password: data.password,
    database: data.database,
    port: data.port,
  });

  db.connect((err) => {
    if (err) throw err;
  });

  module.exports = db;
}


