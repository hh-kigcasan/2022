// require express
var express = require("express");
// path module -- try to figure out where and why we use this

var path = require("path");
// create the express app
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
const server = app.listen(1338);
const io = require('socket.io')(server);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/static"))
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// Have the server render views/index.ejs that has the form for the user to fill out
app.get('/', function(req, res, next) {
  res.render('index')
})
app.get('/verify', function(req, res, next) {
  res.render('otp')
})
app.get('/login', function(req, res, next) {
  res.render('login')
})
app.get('/home', function(req, res, next) {
  res.render('home')
})
app.get('/players', function(req, res, next) {
  res.render('players')
})
app.get('/modes', function(req, res, next) {
  res.render('modes')
})
app.get('/question', function(req, res, next) {
  res.render('question')
})

const accountSid = 'ACdb8081f412bddd98e7e65b7bb2315ecd'; // Your Account SID from www.twilio.com/console
const authToken = 'f4410765eb885dca5002255cc48dd33f'; // Your Auth Token from www.twilio.com/console
const twilio = require('twilio')(accountSid, authToken);
io.on('connection', function(socket){
    let amount = 0;
    socket.on('posting_form', function(data){
        amount += data
      socket.emit('total_amount', amount )
      console.log(amount)
    });
    
socket.on("otp", function(res){
const rand = Math.floor(Math.random()*(999999-100000)+100000)
twilio.messages
  .create({
    body: 'Your otp code is '+ rand,
    to: res[1].value, // Text this number
    from: '+19592712876', // From a valid Twilio number
  })
  .then((message) => {
    console.log(message.sid)
    socket.emit('verify', '/verify')
  })
  .catch(error=>{
    console.log(error)
  });
  })
  const request = require('request');

var category = 'general'
request.get({
  url: 'https://the-trivia-api.com/api/questions?categories=general_knowledge&limit=10',
  // headers: {
  //   'X-Api-Key': 'Xyd4gI3MDVcx2KtZlpnmRQ==zjBBfIPn7eQkupuz'
  // },
}, function(error, response, body) {
  if(error){
     return console.error('Request failed:', error)
    }
  else if(response.statusCode != 200){
    return console.error('Error:', response.statusCode, body.toString('utf8'))
  }
  else{ 
    socket.emit('generate_question', [JSON.parse(body)])
    console.log(body)
  }
});
});







  // twilio.verify.services('VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
  //            .verifications
  //            .create({to: '+639919143680', channel: 'sms'})
  //            .then(verification => console.log(verification.status))
  //            .catch(error=>console.log(error));