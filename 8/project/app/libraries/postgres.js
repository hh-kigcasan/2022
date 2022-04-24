const Pgp = require('pg-promise')(/* initialization options */);
const Yaml = require('js-yaml');
const Fs   = require('fs');

class Postgres{

    constructor(config){
        this.db = "";
        this.cn = "postgres://" + config.user + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.database;
    }

    connect(){
        this.db = Pgp(this.cn);
    }
}

try{
    const config = Yaml.load(Fs.readFileSync('./config/database.yml', 'utf8'));
    module.exports = new Postgres(config.postgres);
}
catch(e){
    console.log(e);
}
  

