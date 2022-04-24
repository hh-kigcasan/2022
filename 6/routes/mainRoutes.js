/**
 * DOCU: Loads the Express Module in order for us
 * to use the Router Function.
 */

const express = require("express");

/**
 * DOCU: Using Express Module rename Router function
 * to Router.
 */

const mainRoutes = express.Router();

/**
 * DOCU: Imports Controller Module
 * NOTE: Controller Exports Ready Made Object
 * No need to create new object.
 */

const mainController = require("../controllers/mainController");

/**
 * DOCU: Using the Object from module controller
 * Routes the User from specific request.
 */

mainRoutes.get("/main", mainController.main);
mainRoutes.get("/add_question", mainController.add_question);
mainRoutes.get("/play", mainController.play);
mainRoutes.post("/questions", mainController.questions);
mainRoutes.post("/load_subjects", mainController.load_subjects);
mainRoutes.post("/load_questions", mainController.load_questions);
mainRoutes.post("/update_score", mainController.update_score);
mainRoutes.post("/share_subject", mainController.share_subject);

/**
 * DOCU: Export Router Module to App.js
 */

module.exports = mainRoutes; 
