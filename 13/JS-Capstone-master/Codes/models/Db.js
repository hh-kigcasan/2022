//REQUIRES:
const my_db = require("../config");
const connection = my_db.connect;
connection.connect();
class DB {
    /* DOCU: This function is to run the queries.
        OWNER: Judy Mae
    */
    run_query(query) {
        let myPromise = new Promise(function(resolve, reject) {
            connection.query(query, (err, res) => {
                if(!err) {
                    resolve({rows: res.rows, query: query});
                }
                else {
                    reject(err.message);
                }
                connection.end;
            });
        });
        return myPromise;
    }
}

//EXPORT IT AS A MODULE
module.exports = DB;