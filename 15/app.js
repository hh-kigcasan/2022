const Express = require("express");
session = require("express-session");
PATH = require("path");
redis = require("redis");
connectRedis = require("connect-redis");

bodyParser = require("body-parser");
router = require("./routes");

const app = Express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(Express.static(PATH.join(__dirname, "./static")));

// const RedisStore = connectRedis(session);

// //Configure redis client
// const redisClient = redis.createClient({
//   host: "localhost",
//   port: 6379,
//   legacyMode: true
// });

// (async () => {
//   await redisClient.connect();
// })();

// redisClient.on("error", function (err) {
//   console.log("Could not establish a connection with redis. " + err);
// });
// redisClient.on("connect", function (err) {
//   console.log("Connected to redis successfully");
// });

// //Configure session middleware
// app.use(session({
//   store: new RedisStore({ client: redisClient }),
//   secret: 'secret$%^134',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//       secure: false, // if true only transmit cookie over https
//       httpOnly: false, // if true prevent client side JS from reading the cookie
//       maxAge: 1000 * 60 * 10 // session max age in miliseconds
//   }
// }));

// Server Settings
PORT = 3000;
const server = app.listen(PORT);
const io = require("socket.io")(server);

let onlineUsers = [];
let chars = [];

io.on("connection", (socket) => {

  console.log("User connected");

  socket.on("join book", (data) => {
    socket.join(data.bookID);
    onlineUsers.push(data);
    console.log(onlineUsers);
    io.to(data.bookID).emit("online users", onlineUsers);
  });

  socket.on("message", (data) => {
    chars.push(data.message);
    io.to(data.bookID).emit("display message", data);
})


 socket.on("disconnect book", (data) => {
  socket.leave(data.bookID);
  onlineUsers.splice(onlineUsers.findIndex(user => user.id === data.id), 1);
  console.log(onlineUsers);
  io.to(data.bookID).emit("online users", onlineUsers);
 });

 
});

app.use("/", router);
