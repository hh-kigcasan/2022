const {mysql, connection, database, constants, app, session} = require('./includes');

class Database {
    static engine = database.engine;

    constructor() {
        database.redis.client = session.redis.createClient({legacyMode: true})
        database.redis.client.connect();
        database.redis.client.on('error', (err) => {
            if (err) {
                console.log('Redis error:', err);
            }
        });

        constants.session.store = new connection.redis(database.redis);
        app.use(session.express(constants.session));
    }

    connect() {
        if (database.engine === 'postgres') {
            this.connection = new connection.pg(database);
        } else if (database.engine === 'mysql') {
            this.connection = mysql.createConnection(database);
        }

        this.connection.connect((err) => {
            if (err) {
                throw err;
            }
        });

        return this.connection;
    }
}

module.exports = Database;