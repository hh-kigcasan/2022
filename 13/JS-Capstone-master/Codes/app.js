const routes = require("./routes.js"); //requires the routes.js
const Profiler = require("./assets/libraries/profiler"); // requires the profiler.js
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const redis = require("redis");
const redisClient = redis.createClient({legacyMode: true});
const redisStore = require("connect-redis")(session);
const app = express();
const server_port = require("./config.js"); //requires the config.js where port number is initialized.
const port = server_port.port; //gets the port number.
const server = app.listen(port); 
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const csrfProtection = csrf({cookie: true});
const io = require("socket.io")(server);
module.exports = io; //export io and use it in socket.js file


redisClient.connect();

redisClient.on("error", (err) => {
    console.log("Redis error: ", err);
});

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(path.join(__dirname, "./assets")));
app.use(session({ 
    secret: "ThisIsHowYouUseRedis",
    name: "_redisPractice",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false},
    store: new redisStore({ host: "localhost", port: 6379, client: redisClient, ttl: 86400}) //this is for the redis
}));

app.use('/', Profiler.profile, csrfProtection, routes); //to use the routes with profiler

