/*
    @Author: Lance Parantar
    EXPRESS_MODEL is a required parent class for models that will be used in Express and have the following methods:
    - fetchALl()
    - fetchById()
    - runQuery()
    
*/
const connectDB = require("../config");
class EXPRESS_MODEL {
  constructor() {
    this.db = connectDB;
  }

  // fetch all records from the database
  // @table-name: the name of the table to fetch from
  fetchAll(table) {
    return new Promise((resolve, reject) => {
      this.db.query(`SELECT * FROM ${table}`, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  // fetch a record by id from the database
  // @id: the id of the record to fetch
  fetchById(table, id) {
    this.db.any(`SELECT * FROM ${table} WHERE id = ${id}`).then((rows) => {
      console.log(rows);
    });
  }

  // Note: used to run INSERT/DELETE/UPDATE, queries that don't return a value
  // @query: the query to run, with ? placeholders for values
  // @values: the values to replace the ? placeholders with

  // Example: Insert into TABLE_NAME (COLUMN_NAME) VALUES (?, ?), [VALUE, VALUE]
  runQuery(query, values) {
   return this.db.query(query, values).then((result) => {
      return result
    })
    .catch((err) => {
      console.log(err);
    });
  }
}

module.exports = EXPRESS_MODEL;
