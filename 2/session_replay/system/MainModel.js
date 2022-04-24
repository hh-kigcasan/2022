// get the mysql/postgres module
const mysql = require('mysql');
const {Client} = require('pg');
const CONFIG = require('../config/config');

// get the database configuration settings
const DB = require('../config/config').DATABASE;

class MainModel 
{
    constructor()
    {
        this.connection = DB.NAME == 'mysql' ? mysql.createConnection(DB.CREDENTIALS) : new Client(DB.CREDENTIALS);
        this.connect();
    }

    connect()
    {
        this.connection.connect(function(err) 
        {
            if (err)
            {
                throw err;
            } 
        });
    }
    
    // This method executes the query. Return a promise.
    executeQuery(query, values = null, profiler = null, isSingleResult = false)
    {
        if (DB.NAME == 'mysql')
        {
            query = mysql.format(query, values);
            
            // set the profiler database query values
            if (CONFIG.PROFILER && profiler)
            {
                profiler['database_queries'].push(query);
            }
        }

        return new Promise((resolve, reject) => {
            this.connection.query(query, values, function (err, result) {
                if (err)
                {
                    reject(err);
                }
                else if (result.insertId)
                {
                    // if the query is to insert data to database, pass the ID to callback function resolve()
                    resolve(result.insertId);
                }
                else if (DB.NAME == 'mysql')
                {
                    // if the query is to get data from database, pass the result to callback function resolve()
                    isSingleResult ? resolve(result[0]) : resolve(result);
                }
                else
                {
                    // pass the result to callback function resolve()
                    isSingleResult ? resolve(result.rows[0]) : resolve(result.rows);
                }
            });	
        });
    }
}

module.exports = MainModel;