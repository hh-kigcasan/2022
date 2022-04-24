const Express = require("express");
const Router = Express.Router();
const Profiler = require("./assets/libraries/profiler");

//CONTROLLERS
const UserController = require("./controllers/Users");
const DashboardController = require("./controllers/Dashboards");

//GET METHODS
Router.get("/", UserController.index);
Router.get("/register", UserController.register);
Router.get("/logout", DashboardController.logout);
Router.get("/dashboard", DashboardController.dashboard);
Router.get("/friends", DashboardController.friends);
Router.get("/video", DashboardController.video);
Router.get("/room/:room_id", DashboardController.room)

//POST METHODS
Router.post("/process_register", UserController.process_register);
Router.post("/process_login", UserController.process_login);
module.exports = Router;