const io = require("./app.js");
const { translate } = require("google-translate-api-browser");
let users = [];
let language = "en";

io.on("connection", function(socket) {
    socket.on("new_chat", function(data) {
        socket.join(data.room_id);
        io.to(data.room_id).emit("chat", {user_chat: data.chat_msg, name: data.name});
    });

    socket.on("join-room", function(data) {
        socket.join(data.room_id);
        if(users.length > 0) {
            for(let i = 0; i < users.length; i++) {
                if(users[i].user_id !== data.user_id) {
                    users.push({user_name: data.user_name, user_id: data.user_id, is_cam_on: false, user_lang: "en"});
                }
            }
        }
        else {
            users.push({user_name: data.user_name, user_id: data.user_id, is_cam_on: false, user_lang: "en"});
        }
        
        socket.broadcast.to(data.room_id).emit("user-connected-msg", {name: data.user_name});
    });

    socket.on("check_user", function(data) {
        socket.join(data.room_id);
        if(users.length > 0) {
            if(users[0].user_id == data.user_id) {
                check_cam(0, data.user_id, data.room_id);
            }
            else if(users[1].user_id == data.user_id) {
                check_cam(1, data.user_id, data.room_id);
            }
        } 
    });

        /* DOCU: This function is to check if the camera of the user is on or off. If off it will go to open_camera function to turn on the camera. If off, it will go to close_camera function to turn off the camera.
        OWNER: Judy Mae
    */
    function check_cam(arr_index, u_id, r_id) {
        if(users[arr_index].is_cam_on == false) {
            open_camera(u_id, r_id);
            users[arr_index].is_cam_on = true;
        }
        else if(users[arr_index].is_cam_on == true) {
            close_camera(u_id, r_id);
            users[arr_index].is_cam_on = false;
        }
    }

    /* DOCU: This function is to broadcast to the other user the camera/video of the first user turned on.
        OWNER: Judy Mae
    */
    function open_camera(u_id, r_id) {
        socket.emit("open_cam", {user_id: u_id, room_id: r_id});
        socket.broadcast.to(r_id).emit("open-all", {user_id: u_id, room_id: r_id});
        return this;
    }

    /* DOCU: This function is to broadcast to the other user the camera/video of the first user is turned off.
        OWNER: Judy Mae
    */
    function close_camera(u_id, r_id) {
        socket.emit("off_cam", {user_id: u_id, room_id: r_id});
        socket.broadcast.to(r_id).emit("off_cam", {user_id: u_id, room_id: r_id});
    }

    socket.on("change_lang", function(data) {
        if(users.length > 0) {
            if(users[0].user_id == data.user_id) {
                users[0].user_lang = data.new_lang;
            }
            else if(users[1].user_id == data.user_id) {
                users[1].user_lang = data.new_lang;
            }
        }
    });

    socket.on("translate_text", function(data) {
        if(users.length > 0) {
            if(users[0].user_id == data.user_id) {
                translate(data.text, { to: users[1].user_lang})
                    .then(res => {
                        socket.join(data.room_id);
                        socket.broadcast.to(data.room_id).emit("show_translate", {new_text: res.text});
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
            else if(users[1].user_id == data.user_id) {
                translate(data.text, { to: users[0].user_lang})
                    .then(res => {
                        socket.join(data.room_id);
                        socket.broadcast.to(data.room_id).emit("show_translate", {new_text: res.text});
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    });

    socket.on("show-sub", function(data) {
        socket.join(data.room_id);
        socket.broadcast.to(data.room_id).emit("subtitle", {text: data.text});
        // socket.broadcast.to(data.room_id).emit("subtitle", {text: data.text});
    });

    socket.on("check_vid", function(data) {
        socket.join(data.room_id);
    });
});