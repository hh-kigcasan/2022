const sessionReplaySocket = require("../models/SessionReplaySocket")
const Profiler = require('../../system/Profiler');

class SessionReplaySocketsController
{
    // this method will initialize the global variable for each user and assign the applicable sockets room.
    // this method return the socketID of those who have access to the host, otherwise, this will initialize the userHtmlData
    async initializeUserAccess(socket, userHtmlData, currentUsers)
    {
        let socketID;

        // if the url is the same as the host, connect the client to the "replayRoom"
        if (socket.request.headers.referer && socket.request.headers.referer.split("://")[1].split("/")[0] == socket.request.headers.host) 
        {
            socketID = socket.id;
            socket.join([socketID, "replayRoom"]);
        }
        else
        {
            let url = (typeof socket.handshake.query.url == 'string') ? socket.handshake.query.url : 'others';
            let webpageID = await sessionReplaySocket.getWebpageID(url);

            userHtmlData[socket.id] = {
                events: [],
                html: {},
                webpageID: webpageID.id || webpageID,
                startTime: socket.handshake.issued,
                endTime: 0,
                isEventsValid: false
            }

            webpageID = userHtmlData[socket.id].webpageID
            currentUsers[webpageID] = currentUsers[webpageID] ? currentUsers[webpageID] + 1 : 1;
        }

        return socketID;
    }

    // this method will set the initial html data of the user
    setInitialHtml(data, io, socket, socketID, htmlData, currentUsers) 
    {
        let screenHeightRatio = Math.floor(500 * 1000 / data.screen_height) / 1000; // 500 is the height of the element container declared on css. 1000 is used to get the value up to 3 decimal places
        let screenWidthRatio = Math.floor(962 * 1000 / data.screen_width) / 1000; // 962 is the width of the element container declared on css. 1000 is used to get the value up to 3 decimal places
        let zoom = screenHeightRatio > screenWidthRatio ? screenWidthRatio : screenHeightRatio;

        let css = '';
        for (let i = 0; i < data.css.length; i++)
        {
            css += data.css[i] + "\n";
        }

        data.css = css;
        data.zoom_iframe = zoom;

        htmlData.html = data;
        io.to("replayRoom").emit('update_replays_list', {socketID: socket.id, currentUsers: currentUsers});
        // io.to("replayRoom").emit('initial_display', data);
    }

    // this method will update the events data
    updateEventsData(data, io, socket, socketID, userData)
    {
        userData.events.push(data.event);
        
        if (data.event.type != 'mousemove')
        {
            userData.isEventsValid = true;
        }
        // console.log(events)
        // io.to("replayRoom").emit('update_dom', data);
    }

    // this method will emit the initial html content
    async displayInitialHtml(data, io, socket, socketID, userHtmlData) 
    {
        if (data.id.split('_')[0] == 'user' && !userHtmlData[data.id])
        {
            userHtmlData[data.id] = await sessionReplaySocket.getUserSessionByID(data.id.split('user_')[1]);
        }

        // get the event with corresponding id (data.id)
        io.to(socketID).emit("initial_display", userHtmlData[data.id].html);
        // socket.emit("initial_display", html); // if the above code does not work properly, use this instead
        
        //*****emit also the data for the progress bar */
    }

    // this method will store the recording of the user to the database when the user is disconnected from sockets.
    async disconnect(data, io, socket, socketID, userHtmlData, currentUsers)
    {
        if (userHtmlData[socket.id])
        {
            currentUsers[userHtmlData[socket.id].webpageID] = currentUsers[userHtmlData[socket.id].webpageID] - 1;
        }

        if (socketID == socket.id || !Object.keys(userHtmlData[socket.id].html).length || !userHtmlData[socket.id].isEventsValid)
        {
            io.to("replayRoom").emit('update_replays_list', {socketID: socket.id, disconnect: true, currentUsers: currentUsers});
            return;
        }

        userHtmlData[socket.id].endTime = Date.now();

        // store data to the database
        let userID = await sessionReplaySocket.addUserSessionRecord(userHtmlData[socket.id]);

        // delete the data of the user live event via garbage collector and remove the live user from the video list
        io.to("replayRoom").emit('update_replays_list', {socketID: socket.id, disconnect: true, currentUsers: currentUsers});

        // get the data of the disconnected user and append it to the dashboard page
        let newUserData = await sessionReplaySocket.getUserSessionByID(userID);
        let newUser = {
            newUserID: userID, 
            webpageID: newUserData.webpage_id,
            time: newUserData.time, 
            created_at: newUserData.created_at
        };

        io.to("replayRoom").emit('update_replays_list', newUser);
        console.log(newUser);
    }

    // this method will emit the events to display on the dashboard
    emitEvents(data, io, socket, socketID, userHtmlData, nextTime = 0, eventIndex = 0)
    {
        // emit to stop button when no valid user_id to play
        // if the eventIndex is greater than or equal to the total events, emit 'play_done' and stop the recursion
        if (!userHtmlData[data.id] || eventIndex >= userHtmlData[data.id].events.length)
        {
            io.to(socketID).emit("play_done");
            return;
        }

        let events = userHtmlData[data.id].events;
        let currentTime = 0;
        let succedingTime = 0;

        currentTime = eventIndex == 0 ? 0 : events[eventIndex - 1].time;
        succedingTime = events[eventIndex].time;
        nextTime = succedingTime - currentTime;
        eventIndex++;

        let timeoutID = setTimeout(() => {
            io.to(socketID).emit("playing", events[eventIndex - 1]);
            // socket.emit("playing", events[eventIndex - 1]); // if the above code does not work properly, use this instead
            this.emitEvents(data, io, socket, socketID, userHtmlData, nextTime, eventIndex);
        }, nextTime);
    }

    // This method will get the html content together with clicked events from the model-database and then emits to client the data
    async emitClickedEvents(data, io, socket, socketID)
    {
        let result = await sessionReplaySocket.getAllUsersEventsByWebpageID(data.heatmapID);
        io.to(socketID).emit("display_heatmap", result);
    }



    // ****************play/pause - if play button is clicked, get the location of the slider to know which time to start.
}

module.exports = new SessionReplaySocketsController();