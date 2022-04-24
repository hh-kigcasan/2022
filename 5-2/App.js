import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import Login from "./screens/Login";
import Tracker from "./screens/Tracker";
import { io } from "socket.io-client";
import * as Location from "expo-location";
const socket = io(`https://techtrack-admin.herokuapp.com`);
// const socket = io(`http://192.168.0.18:8888/`);

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [location, setLocation] = useState({ longitude: 0, latitude: 0 });
    const [avatar, setAvatar] = useState("avatar1.png");
    const [allUsers, setUsers] = useState([]);

    useEffect(() => {
        socket.on("valid_login", function (data) {
            setTimeout(() => {
                setUsername(data.username);
                setAvatar(data.avatar);
                setUsers((user) => [...user, ...data.others]);
                setLoggedIn(true);
            }, 2000);
        });

        socket.on("logoff", function () {
            setLoggedIn(false);
        });

        return;
    }, []);

    (async () => {
        const { permission } = await Location.requestForegroundPermissionsAsync();

        const { coords } = await Location.getCurrentPositionAsync();
        setLocation({ longitude: coords.longitude, latitude: coords.latitude });
    })();

    return (
        <>
            {loggedIn ? (
                <Tracker socket={socket} username={username} avatar={avatar} start={location} users={allUsers} />
            ) : (
                <Login socket={socket} location={location} />
            )}
        </>
    );
}
