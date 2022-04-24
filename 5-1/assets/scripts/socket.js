const socket = io();
const techs = new Set();
const markers = {};
const cc = new ChatControls(socket);
const btnSend = document.getElementById("btnSend");
const btnSendTo = document.getElementById("btnSendTo");
const sendToList = document.querySelectorAll(".dropdown-item");
let sendTo = "all";

//Event listeners
$(document).ready(function () {
    socket.on("update", function (data) {
        const { username, accuracy, longitude, latitude, altitude, speed, heading, avatar, timestamp } = data;
        if (techs.has(username)) {
            markers[username].setLngLat([longitude, latitude]);
        } else {
            techs.add(username);
            markers[username] = newMarker(username, longitude, latitude, avatar);
        }
        updateSensor(username, timestamp, longitude, latitude, altitude, speed, heading);
    });
    function newMarker(name, longitude, latitude, avatar) {
        const r = Math.ceil(Math.random() * 3);
        const el = document.createElement("div");
        el.className = "marker";
        el.id = name;
        el.style.backgroundImage = `url("./assets/images/${avatar}")`;
        el.style.width = `50px`;
        el.style.height = `50px`;
        el.style.backgroundSize = "100%";
        el.innerHTML = `<h6>${name}</h6>`;
        return new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map);
    }

    function updateSensor(username, timestamp, longitude, latitude, altitude, speed, heading) {
        $(`#${username} .longitude`).text("");
        $(`#${username} .latitude`).text("");
        $(`#${username} .altitude`).text("");
        $(`#${username} .speed`).text("");
        $(`#${username} .heading`).text("");
        $(`#${username} .timestamp`).text("");

        setTimeout(() => {
            $(`#${username} .timestamp`).text(timestamp);
            $(`#${username} .longitude`).text(longitude);
            $(`#${username} .latitude`).text(latitude);
            $(`#${username} .altitude`).text(altitude);
            $(`#${username} .speed`).text(speed);
            $(`#${username} .heading`).text(heading);
        }, 200);
    }

    setInterval(() => {
        const sensors = Array.from($("#sensor-data tr"));
        sensors.forEach((user) => {
            const now = Date.now();
            const last = $(`#${user.id} .timestamp`).text();

            if (now - last > 6000) {
                $(`#${user.id} .status i`).removeClass("online");

                if ($(`div#${user.id}`).length > 0) {
                    $(`div#${user.id}`).css("background-image", `url("./assets/images/offline.png")`);
                }
            } else {
                $(`#${user.id} .status i`).addClass("online");
                if ($(`div#${user.id}`).length > 0) {
                    const url = $(`#${user.id} img`)[0].currentSrc;
                    $(`div#${user.id}`).css("background-image", `url("${url}")`);
                }
            }
        });
    }, 5000);

    socket.on("admin", function (data) {
        cc.render(data.to, data.sender, data.message);
    });

    socket.on("all", function (data) {
        cc.render(data.to, data.sender, data.message);
    });

    $("#btnSend").on("click", function () {
        if ($("#inputChat").val().trim() != "") {
            cc.emitChat(sendTo, "admin", $("#inputChat").val());
            $("#inputChat").val("");
        }
    });

    $(".dropdown-item").on("click", function (e) {
        sendTo = e.target.text;
        $("#btnSend").html(sendTo + ` <i class="bi bi-send-fill"></i>`);
    });

    $(".modal form").on("submit", function (e) {
        e.preventDefault();
        $("#chatbody").scrollTop($("#chatbody")[0].scrollHeight);
    });

    $(".flyto a").click(function () {
        flyTo($(this).text());
    });

    function flyTo(tech) {
        const row = $(`#${tech} td`);
        console.log(row.length);
        console.log(row[1].textContent, row[2].textContent);

        map.flyTo({
            center: [row[1].textContent, row[2].textContent],
            essential: true,
        });
    }
});
