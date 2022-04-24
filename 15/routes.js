const Express = require("express");
const Router = Express.Router();

const MainController = require("./controllers/MainController");

Router.get("/", MainController.index);

module.exports = Router;
