require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const port = process.env.MY_PORT;
const server = app.listen(process.env.PORT || port, () =>
    console.log("Sockets Server starting at port:", process.env.PORT || port)
);

app.use(
    session({
        secret: "$3cr3t!",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

const io = require("socket.io")(server);
const mongoose = require("mongoose");
const User = require("./models/User");
const Client = require("./models/Client");
const cors = require("cors");

app.use(cors());
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas, Database:", "tracker"));

app.get("/", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    const users = await User.find({ is_admin: false }).select("username avatar");
    // const clients = await Client.find().select("name longitude latitude ticket address");
    res.render("index", { users });
});

app.get("/login", async (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("login");
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const result = await User.findOne({ username: username });

    if (result) {
        req.session.user = result._id;
        res.redirect("/");
    } else {
        res.redirect("/login");
    }
});

app.use("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

//SOCKETS

const techs = new Set();
const sensors = {};

io.on("connection", function (socket) {
    console.log(socket.id, "connected");
    //New user signup
    socket.on("validate_signup", async function (data) {
        const { values, avatar } = data;
        // console.log(values.username, values.password, avatar);
        const { username, password } = values;

        const result = await User.findOne({ username: username });

        if (result == null) {
            const new_user = new User({
                username: username,
                password: password,
                avatar: avatar,
            });
            await new_user.save();
            socket.emit("backToLogin", { message: "Success" });
        } else {
            socket.emit("invalid_signup", { message: "User Name already taken" });
        }
    });
    // React Native App authenticate
    socket.on("validate_login", async function (data) {
        const { values, location } = data;
        const { username, password } = values;
        //test mode
        const result = await User.findOne({ username: username, password: password });
        if (result) {
            let others = await User.find({ username: { $ne: username } });
            others = others.map((user) => user.username);
            socket.emit("valid_login", { username: username, avatar: result.avatar, status: true, others: others });
        } else {
            socket.emit("invalid_login", { status: false, message: "Invalid Credentials" });
        }
    });
    //navigate back to login
    socket.on("backToLogin", function () {
        socket.emit("backToLogin");
    });

    //User log off
    socket.on("logoff", function () {
        socket.emit("logoff");
    });

    //notify admin tech is moving
    socket.on(
        "update",
        function ({ username, avatar, longitude, latitude, speed, altitude, heading, timestamp, accuracy }) {
            // console.log("moving", username, avatar, longitude, latitude);
            techs.add(username);
            sensors[username] = { longitude, latitude, speed, altitude, heading, timestamp, accuracy };
            socket.broadcast.emit("update", {
                username,
                avatar,
                longitude,
                latitude,
                speed,
                altitude,
                heading,
                timestamp,
                accuracy,
            });
        }
    );

    //Chat
    socket.on("chat_listener", function (data) {
        console.log(data.to);
        socket.broadcast.emit(data.to, {
            to: data.to,
            sender: data.sender,
            message: data.message,
        });
    });
});
