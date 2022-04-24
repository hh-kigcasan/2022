// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
var session = require('cookie-session');
// create the express app
var app = express();
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))
  
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})
// post route for adding a user
app.post('/', function(req, res) {
 //console.log("POST DATA", req.body);
 // This is where we would add the user to the database
 // Then redirect to the root route
 res.redirect('/');
})
// tell the express app to listen on port 8000
/*app.listen(8000, function() {
 console.log("listening on port 8000");
});*/

app.post('/users', function (req, res){
    // set the name property of session.  
    req.session.name = req.body.name;
    console.log(req.session.name);
    //code to add user to db goes here!
    // redirect the user back to the root route. 
    res.redirect('/');
});
const url = 'http://swapi.co/api/people';
const axios = require('axios');
app.get('/people', function(req, res)
{
    // use the axios .get() method - provide a url and chain the .then() and .catch() methods
    axios.get(url)
    .then(data => {
        // log the data before moving on! 
        console.log(data);
        // rather than rendering, just send back the json data!
        res.json(data);
    })
    .catch(error => {
        // log the error before moving on!
        console.log(error);
        res.json(error);
    })
});

const server = app.listen(process.env.PORT || 3000);
const io = require('socket.io')(server); //The require('socket.io')(http) creates a new socket.io instance attached to the http server. The 
var counter = 0;
let record = [];
let recorded = 0;

io.on('connection', function (socket) //2
 { 

    console.log(socket.id);
   
    socket.on('press', function (data)
     { 
        let key = data;
        console.log(key);

        if(recorded == 1)
        record.push(key);

        io.emit('update', key);
      });
    
    
      socket.on('record', function ()
      { 
        console.log("record on");
        recorded = 1;

      
      });
 
      socket.on('play', function ()
      { 
        console.log("play!");
        console.log(record);
        io.emit('proceed', record);
      
      });

      socket.on('refresh', function ()
      { 
        console.log("refresh!");
        record = [];
        console.log(record);
  
      });


     
      
  });

 