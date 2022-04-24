$(document).ready(function() {
    let socket = io();
    const room_id = $("#room-id").text();

    $("#msg-send").click(function() {
        let user = $("#user-name").text();
        let chat = $("#user-chat").val();
        socket.emit("new_chat", {chat_msg: chat, name: user, room_id: room_id});
        $("#user-chat").val('');
        $("#user-chat").removeClass("big");
    });

    socket.on("chat", function(data) {
        if(data.name === $("#user-name").text()) {
            $("#chatbox").append("<p><span style = 'font-weight: bold'>Me: </span>" + data.user_chat + "</p>");
        }
        else {
            $("#chatbox").append("<p><span style = 'font-weight: bold'>" + data.name + ": </span>" + data.user_chat + "</p>");
        }
        
    });

});