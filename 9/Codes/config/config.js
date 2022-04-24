const fs = require('fs');
const YAML = require('js-yaml');
const raw = fs.readFileSync('./config/config.yml');
const data = YAML.load(raw);
const session = require('express-session');

class Config {
    /* 
        DOCU: The set_port function sets the port number.
    */
    set_port(port){
        this.port = port; 
    }
    /* 
        DOCU: The get_port function gets the port number to be assigned on the port number in the app.js.
    */
    get_port(){
        return this.port; 
    }
    /* 
        DOCU: The set_mysql_credentials function sets the MySQL credentials.
    */
    set_mysql_credentials(credentials){
        this.mysql_credentials = credentials;
    }
    /* 
        DOCU: The get_mysql_credentials function gets the MySQL credentials to be used to create connection to the 
        MySQL in mysql.js.
    */
    get_mysql_credentials(){
        return this.this.mysql_credentials;
    }
    /* 
        DOCU: The set_mysql_credentials function sets the MySQL credentials.
    */
    set_postgres_credentials(credentials){
        this.postgres_credentials = credentials;
    }
    /* 
        DOCU: The get_mysql_credentials function gets the MySQL credentials to be used to create connection to the 
        MySQL in mysql.js.
    */
    get_postgres_credentials(){
        return this.postgres_credentials;
    }
    /* 
        DOCU: The set_session_settings function sets the session settings.
    */
    set_session_settings(session){
        this.session = session;
    }
    /* 
        DOCU: The get_mysql_credentials function gets the session settings to be used to create connection in app.js.
    */
    get_session_settings(){
        return this.session;
    }
}

const configurations = new Config();
//Set the port number
configurations.set_port(data.port);
//Set MySQL crendetials
configurations.set_mysql_credentials({
    host: data.mysql.host,
    user: data.mysql.user,
    password: data.mysql.password,
    database: data.mysql.database,
    port: data.mysql.port,
});
configurations.set_postgres_credentials({
    host: data.postgres.host,
    user: data.postgres.user,
    password: data.postgres.password,
    database: data.postgres.database,
    port: data.postgres.port,
});
configurations.set_session_settings({
    name: data.session.name,
    secret: data.session.secret,
    resave: data.session.resave,
    saveUninitialized: data.session.saveUninitialized,
})
//module.exports to be required in app.js
module.exports = configurations;





