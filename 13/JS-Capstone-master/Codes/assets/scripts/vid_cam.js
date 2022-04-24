$(document).ready(function() {
    let socket = io();
    const myPeer = new Peer(undefined, {
        host: "/",
        port: "3001"
    });
    const room_id = $("#room-id").text();
    const name = $("#user-name").text();
    const user_id = $("#sess-id").text();
    const videoGrid = $("#video-grid");
    const myVideo = document.createElement("video");
    myVideo.muted = true;

    socket.emit("join-room", {room_id: room_id, user_name: name, user_id: user_id});

    socket.on("user-connected-msg", function(data) {
        let html_str = data.name + "joined the call";
        $("#user-join-msg").show();
        $("#user-join-msg").html(html_str);
        $("#user-join-msg").delay(2000).fadeOut("slow");
    });
    

    $(document).on("click", "#start", function() {
        socket.emit("check_user", {user_id: user_id, room_id: room_id});
    });

    socket.on("open_cam", function(data) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(function(stream) {
            addVideoStream(myVideo, stream, data.user_id);
        });
    });

    socket.on("open-all", function(data) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(function(stream) {
            let new_vid = document.createElement("video");
            new_vid.muted = true;
            addVideoStream(new_vid, stream, data.user_id);
        });
    });

    socket.on("off_cam", function(data) {
        $("#" + data.user_id).remove();
    });

    socket.on("off-all", function(data) {
        $("#" + data.user_id).remove();
    });


    function addVideoStream(video, stream, u_id) {
        video.srcObject = stream;
        video.setAttribute("id", u_id);
        video.addEventListener("loadedmetadata", function() {
            video.play();
        });
        videoGrid.append(video);
    }
});