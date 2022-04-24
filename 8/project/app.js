const Express = require("express");
const File_Upload = require("express-fileupload");
const Routes = require("./routes/loader");
const Session = require('express-session');
const Flash = require('./app/libraries/flash');
const Yaml = require('js-yaml');
const Fs = require('fs');
let app = Express();
let bodyParser = require('body-parser');

try{
  const app_config = Yaml.load(Fs.readFileSync('./config/application.yml', 'utf8'));

  app.use(bodyParser.json());
  app.use(Session({
    secret: 'ThisIsHowYouUseRedisSessionStorage',
    name: '_redisPractice',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  }));  
  
  app.use(Flash["middleware"]);
  app.use(File_Upload());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/', Routes);
  app.use("/assets", Express.static(__dirname + app_config.public_folder)); 
  app.set('views', __dirname + app_config.views_folder); 
  app.set('view engine', app_config.engine);

  app.listen(app_config.server_port, function() {
    console.log(app_config.server_port);
  });
} 
catch(e){
  console.log(e);
}










