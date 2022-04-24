/**
 * DOCU: Loads the Express Module in order for us
 * to use the Router Function.
 */

const express = require("express");

/**
 * DOCU: Using Express Module rename Router function
 * to Router.
 */

const userRoutes = express.Router();

/**
 * DOCU: Imports Controller Module
 * NOTE: Controller Exports Ready Made Object
 * No need to create new object.
 */

const userController = require("../controllers/userController");

/**
 * DOCU: Using the Object from module controller
 * Routes the User from specific request.
 */

userRoutes.get("/", userController.index);
userRoutes.get("/login", userController.login);
userRoutes.get("/register", userController.register);
userRoutes.post("/validate", userController.validate);
userRoutes.get("/settings", userController.settings);
userRoutes.post("/logout", userController.logout);

/**
 * DOCU: Export Router Module to App.js
 */

module.exports = userRoutes; 
