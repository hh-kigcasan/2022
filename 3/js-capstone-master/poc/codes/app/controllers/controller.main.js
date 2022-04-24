const Controller = require("../../system/core/controller");

class MainController extends Controller {
    constructor() {
        super(arguments);
    }

    index() {
        this.render('main');
    }
}

module.exports = MainController;
