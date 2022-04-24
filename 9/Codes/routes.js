const Express = require('express');
const Router = Express.Router();
const Tests = require(`./controllers/tests`);

Router.get('/', Tests.index);
Router.post('/test', Tests.test);
Router.get('/report', Tests.report);


//module.exports to be required in app.js
module.exports = Router;
