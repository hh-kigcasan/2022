const DB = require("../../config/database");
DB.connect();

class Database {
    getRecord(sql){
        return new Promise((resolve, reject) => {
            DB.Connection.query(sql, (err, results) => {
                err ? reject(err) : resolve(results.rows[0]);
                DB.Connection.end;    
            });
        })
    }
    
    getAll(sql, value){
        return new Promise((resolve, reject) => {
            DB.Connection.query(sql, value, (err, results) => {
                err ? reject(err) : resolve(results.rows);
                DB.Connection.end;  
            });
        })
    }

    findId(sql, value){
        return new Promise((resolve, reject) => {
            DB.Connection.query(sql, value, (err, results) => {
                err ? reject(err) : resolve(results.rows[0]);
                DB.Connection.end;  
            });
        })
    }

    executeQuery(sql, value){
        return new Promise((resolve, reject) => {
            DB.Connection.query(sql, value, (err, results) => {
                err ? reject(err) : resolve(results.rows);
                DB.Connection.end; 
            });
        })
    }
}
module.exports = new Database();