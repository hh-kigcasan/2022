const Mysql = require('mysql');
const Config = require('../config/config');

class Mysql_Database{
    constructor(){
        const credentials = Config.get_mysql_credentials();
        this.connection = Mysql.createConnection(credentials);
        this.connection.connect(function (err) {
            if(err){ 
                throw err;
            }
        });
    }
    /* 
        DOCU: The execute_query function runs the query.
    */
    execute_query(query, values){
        return new Promise((resolve,reject) => {
            this.connection.query(query, values, function (err, result){
                if(err === null){
                    resolve(result);
                }
                else{
                    reject(err);
                }
            });
        });
    }
}

module.exports = new Mysql_Database;
