/*
 *   This is a controller class for the users.
 *   @Author: Lance Parantar
 *   
 *   Get the Model object from the models folder
 *   Example: StudentModelt = require('../models/StudentModel');
 */

const Validator = require("../system/utils/validator");
const Hash = require("../system/utils/hash");

class MainController {
    index(req, res) {
        res.render("index.ejs");
    }
}

module.exports = new MainController();
