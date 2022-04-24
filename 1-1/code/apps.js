const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("config.yaml"));
const db = require("./lib/database");

db.connectDB();

// use it!
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./assets")));
// setting up ejs and our views folder
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
// root route to render the index.ejs view
app.use(
	session({
		secret: "C4pst0n3",
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
			maxAge: 60000,
			path: "/",
		},
	})
);

const users = require("./routes/userRoutes");
const dashboard = require("./routes/dashboardRoutes");
// routes
app.use("/", users);
app.use("/dashboard", dashboard);

// tell the express app to listen on port 8000
const server = app.listen(config.port, () => {
	console.log("listening on port 8000");
});

const io = require("socket.io")(server);
app.set("socketio", io);
