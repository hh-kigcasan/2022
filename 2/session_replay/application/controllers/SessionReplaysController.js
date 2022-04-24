const Profiler = require('../../system/Profiler');
const sessionReplaySocket = require("../models/SessionReplaySocket")

class SessionReplaysController
{
    // This method renders the dashboard page
    async index(req, res)
    {
        res.render('dashboard', {webpages: await sessionReplaySocket.getAllWebpagesWithUsers()});
    }

    // This method renders the views partials on AJAX call
    async processSearch(req, res)
    {
        let result = await sessionReplaySocket.getAllUsersByWebpageID(req.body.webpage, req.body.order_by);
        res.render('./partials/dashboard_partial', {users: result});
    }
}

module.exports = SessionReplaysController;