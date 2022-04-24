const Express = require("express");
const App = Express();
const Path = require("path");
const Session = require("express-session");
const bodyParser = require("body-parser");

App.use(bodyParser.urlencoded({extended: true}));
App.use(Express.static(Path.join(__dirname, "./app/assets")));
App.set("views", Path.join(__dirname, "./app/views"));
App.set("view engine", "ejs");

// Create and listen to server
App.listen(8000, "localhost", () => {
    console.log("Listening on 8000");
});

const TweetRoutes = require("./routes/TweetRoutes");

// Render Routes
App.use(TweetRoutes);

// Error handler
App.use((req, res) => {
    res.status(404).render("error404");
});