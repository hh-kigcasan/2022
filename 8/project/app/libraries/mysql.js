const Mysql = require('mysql');
const Yaml = require('js-yaml');
const Fs = require('fs');
const Profiler = require('./profiler');

class Mysql_DB{

    constructor(config){

        this.host = config.host;
        this.user = config.user;
        this.password = config.password;
        this.database = config.database;
        this.port= config.port;
        this.connection = "";
        this.data ="";
    }

    connect(){

        this.connection = Mysql.createConnection({
            "host": this.host,
            "user": this.user,
            "password": this.password,
            "database": this.database,
            "port": this.db_port
        });

        this.connection.connect(function(err) {
            if (err) throw err;
        });
    }

    query(query,values){
    
        return new Promise((resolve,reject) =>{
            
            this.connection.query(query,values,function (err, result){
                if(err == null){
                    Profiler.modify("sql", this.sql);
                    this.data = result;
                    resolve(this);
                }
                else{
                    reject(err);
                }
            });
        });
       
    }
}

try{
    const config = Yaml.load(Fs.readFileSync('./config/database.yml', 'utf8'));
    module.exports = new Mysql_DB(config.mysql);
}
catch(e){
    console.log(e);
}
