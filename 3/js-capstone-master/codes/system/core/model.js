const {xss, validator, mysql, md5, Profiler} = require("./includes");
const Database = require('../../system/core/database');

class Model extends Database {
    constructor() {
        super();
    }

    execute_query(query, data = []) {
        return new Promise((resolve, reject) => {
            const callback = (err, result) => {
                if (err) {
                    //reject(err);
                    throw err;
                } else {
                    resolve(result);
                }
                Profiler.collect_queries(query, data);
                this.connect().end();
            }

            if (Database.engine === 'postgres') {
                this.connect().query(query, data, callback);
            } else if (Database.engine === 'mysql') {
                this.connect().query(mysql.format(query, data), callback);
            }
        });
    }

    xss_clean(html) {
        return xss.filterXSS(html);
    }

    set_rules(obj) {
        return validator.set_rules(obj);
    }

    md5(value) {
        return md5(value);
    }
}

module.exports = Model;