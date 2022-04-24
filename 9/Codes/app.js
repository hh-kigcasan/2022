//NPM modules
const Express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const csurf = require('csurf');

//My Modules
const app = Express();
const routes = require('./routes');
const Config = require('./config/config');
const port = Config.get_port();
const session_settings = Config.get_session_settings();

app.use(session(session_settings));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(Express.static(path.join(__dirname, './assets')));
app.use(flash());
app.use(csurf());
app.use(routes);

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.listen(port, function(){
	console.log('listening on port ' + port);
});