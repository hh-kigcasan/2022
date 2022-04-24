// get the modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// get the redis module
const redis = require('./system/Redis');

// get the configuration/settings
const CONFIG = require('./config/config')

// get the routes
const routes = require('./system/Router');

// get the Profiler class and create an instance of it
const profiler = new (require('./system/Profiler'))();

// create the express app
const app = express();

// set the directory of the views folder and set the template engine
app.set('views', path.join(__dirname, './application/views'));
app.set('view engine', CONFIG.TEMPLATE_ENGINE);

// tell express to use the body-parser module
app.use(bodyParser.urlencoded({extended: true}));

// tell express to use the directory of the static folder
app.use(express.static(path.join(__dirname, './assets')));

// tell express to use session. This also set the session options
CONFIG.IS_REDIS ? app.use(session(redis.start().getSessionValues())) : app.use(session(CONFIG.SESSION_EXPRESS));

// tell express to use the profiler and add the rendered data at the end of the html
app.use(profiler.processData);

// tell express to use the routes
app.use(routes);

// tell express app to listen on this port
const server = app.listen(CONFIG.PORT, function() {
    console.log(`Listening on port ${CONFIG.PORT}`);
});

// get the socket.io module and invoke with 'server' as argument
// const io = require('socket.io')(server);
const Socket = require('socket.io');
const io = Socket(server, {
    cors: {
        origin: "*"
    }
});

// get the SessionReplaySockets instance object and invoke the start method with io as argument to execute the io.on() method
const sessionReplaySockets = require('./config/sockets/SessionReplaySockets');
sessionReplaySockets.start(io);