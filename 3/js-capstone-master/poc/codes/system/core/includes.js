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

module.exports = {
    validator: validator,
    express: express,
    mysql: mysql,
    xss: xss,
    fs: fs,
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
    app: express(),
    router: express.Router(),
    constants: yaml.parse(fs.readFileSync('app/config/constants.yml', 'utf8')),
    database: yaml.parse(fs.readFileSync('app/config/database.yml', 'utf8')),
    Profiler: profiler
}
