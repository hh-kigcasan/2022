const validator = require("../libraries/validator");
const express = require('express');
const mysql = require('mysql');
const {Client} = require('pg');
const xss = require('xss');
const fs = require('fs');
const yaml = require('yaml');
const session = require('express-session');
const redis = require('redis');
const redis_store = require('connect-redis')(session);
const path = require('path');
const body_parser = require('body-parser');
const profiler = require('../libraries/profiler');
const axios = require('axios');
const query_string = require('qs');
const app = express();
const constants = yaml.parse(fs.readFileSync('app/config/constants.yml', 'utf8'));
const server = app.listen(constants.port, () => {
    console.log('Listening to pot', constants.port);
});
const io = require('socket.io')(server);
const md5 = require('md5');

module.exports = {
    validator: validator,
    express: express,
    mysql: mysql,
    xss: xss,
    fs: fs,
    axios: axios,
    query_string: query_string,
    session: {
        express: session,
        redis: redis
    },
    connection: {
        pg: Client,
        redis: redis_store
    },
    path: path,
    body_parser: body_parser,
    app: app,
    io: io,
    router: express.Router(),
    constants: constants,
    database: yaml.parse(fs.readFileSync('app/config/database.yml', 'utf8')),
    Profiler: profiler,
    md5: md5
}
