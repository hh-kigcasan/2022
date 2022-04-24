const sr = require('../../application/controllers/SessionReplaySocketsController');

// declare a global variable for all users
let userHtmlData = {}; 
let currentUsers = {};

class SessionReplaySockets
{
    start(io)
    {
        io.on("connection", async function(socket) {
            
            // initialize the socketID if the host is the same as the request url
            let socketID = await sr.initializeUserAccess(socket, userHtmlData, currentUsers);
            
            // event listener for every users session. This will store the initial html data of the user
            socket.on('data_to_replay', function(data) {
                sr.setInitialHtml(data, io, socket, socketID, userHtmlData[socket.id], currentUsers);
            });
        
            // event listener when there are events on the user. This method will push the data to the events array.
            socket.on("events_data", function(data) {
                sr.updateEventsData(data, io, socket, socketID, userHtmlData[socket.id]);
            });
        
            // event listener when a user record is clicked
            socket.on("user_records_clicked", function(data) {
                sr.displayInitialHtml(data, io, socket, socketID, userHtmlData);
            });
        
            // event listener when play_btn is clicked
            socket.on('play', function(data) {
                sr.emitEvents(data, io, socket, socketID, userHtmlData);
            });
        
            // event listener when heatmap_btn is clicked
            socket.on('show_heatmap', function(data) {
                sr.emitClickedEvents(data, io, socket, socketID);
            });
        
            // event listener when the user is disconnected. Store the data to the database.
            socket.on("disconnect", function(data) {
                sr.disconnect(data, io, socket, socketID, userHtmlData, currentUsers);
            });
        });
    }
}

module.exports = new SessionReplaySockets;