const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users");

router.get("/", UsersController.index);
router.get("/register", UsersController.register);
router.get("/login", UsersController.login);
router.post("/login", UsersController.process_login);
router.post("/register", UsersController.process_register);
//router.get("/users/edit", UsersController.editProfile);
//router.post("/edit", UsersController.edit);
router.get("/logoff", UsersController.logoff);
//router.post("/changepassword", UsersController.changePassword);

module.exports = router;
