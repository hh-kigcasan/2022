const { prototype } = require("express-session/session/cookie");
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const CONFIG = {};
const database = fs.readFileSync(path.join(__dirname, './database.yaml'));
const session = fs.readFileSync(path.join(__dirname, './session.yaml'));

// parse the yaml data to json
const DB = yaml.load(database);
const SESSION = yaml.load(session);

// set which database to use
CONFIG.DATABASE = DB.DATABASE_MYSQL;

// declare the database credentials redis
CONFIG.DATABASE_REDIS = DB.DATABASE_REDIS;

// declare which port number to be use.
CONFIG.PORT = 7999;

// declare the template engine to be use.
CONFIG.TEMPLATE_ENGINE = 'ejs';

// declare the session values
CONFIG.SESSION_EXPRESS = SESSION.SESSION_EXPRESS;

// declare the session values for redis
CONFIG.SESSION_REDIS = SESSION.SESSION_REDIS;

// declare if redis is to be use for session
CONFIG.IS_REDIS = false;

// initialize CONFIG.PROFILER to true to enable the profiler.
CONFIG.PROFILER = true;

module.exports = CONFIG;