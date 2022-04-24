const crypto = require('crypto');
const xssFilters = require('xss-filters');
const MainModel = require('../../system/MainModel');
const fv = require('../../system/FormValidation');

class SessionReplaySocket extends MainModel
{
    // get the users session records by ID
    async getUserSessionByID(id, profiler = null)
    {
        id = xssFilters.inHTMLData(id);
        let result = await this.executeQuery('SELECT * FROM users_session_records WHERE id = ?', [id], profiler, true);

        if (!result)
        {
            return [];
        }

        // parse data to JSON
        result.events = JSON.parse(result.events);
        result.html = JSON.parse(result.html);

        // convert date to local time
        result.created_at = (new Date(result.created_at)).toLocaleString();

        // convert time in millisec to HH:MM:SS format
        let timeHours = result['total_time_in_millisec'] / (60 * 60 * 1000); //convert from millisec to hours
        let timeMinutes = (timeHours % 1) * 60; // convert hours to minutes
        let timeSeconds = (timeMinutes % 1) * 60; // convert minutes to seconds

        timeHours = Math.floor(timeHours);
        timeMinutes = Math.floor(timeMinutes);
        timeSeconds = Math.ceil(timeSeconds);

        let timeHoursStr = timeHours < 10 ? `0${timeHours}` : timeHours;
        let timeMinutesStr = timeMinutes < 10 ? `0${timeMinutes}` : timeMinutes;
        let timeSecondsStr = timeSeconds < 10 ? `0${timeSeconds}` : timeSeconds;

        let timeFormatted = `${timeHoursStr}:${timeMinutesStr}:${timeSecondsStr}`;

        result['time'] = timeFormatted;

        return result;
    }

    // get the all webpages with corresponding users
    async getAllWebpages(profiler = null)
    {
        return await this.executeQuery(`SELECT * FROM webpages`, null, profiler);
    }

    // get the all webpages with corresponding users
    async getAllWebpagesWithUsers(profiler = null)
    {
        let query =    `SELECT COUNT(*) AS total_users, webpage_id, url, AVG(total_time_in_millisec) AS ave_time
                        FROM users_session_records 
                        LEFT JOIN webpages ON users_session_records.webpage_id = webpages.id
                        GROUP BY webpage_id
                        ORDER BY url`;
        let result = await this.executeQuery(query, null, profiler);

        // loop through the result and change the ave_time in HH:MM:SS format
        for (let i = 0; i < result.length; i++)
        {
            let timeHours = result[i]['ave_time'] / (60 * 60 * 1000); //convert from millisec to hours
            let timeMinutes = (timeHours % 1) * 60; // convert hours to minutes
            let timeSeconds = (timeMinutes % 1) * 60; // convert minutes to seconds

            timeHours = Math.floor(timeHours);
            timeMinutes = Math.floor(timeMinutes);
            timeSeconds = Math.ceil(timeSeconds);

            let timeHoursStr = timeHours < 10 ? `0${timeHours}` : timeHours;
            let timeMinutesStr = timeMinutes < 10 ? `0${timeMinutes}` : timeMinutes;
            let timeSecondsStr = timeSeconds < 10 ? `0${timeSeconds}` : timeSeconds;

            let timeFormatted = `${timeHoursStr}:${timeMinutesStr}:${timeSecondsStr}`;

            result[i]['ave_time'] = timeFormatted;
        }

        return result;
    }

    // get all users by webpage ID
    async getAllUsersByWebpageID(id, orderBy = 0, profiler = null)
    {
        id = xssFilters.inHTMLData(id);
        orderBy = xssFilters.inHTMLData(orderBy);

        // if orderBy == 1 (meaning it is from oldest to newest)
        orderBy = orderBy == 1 ? 'ASC' : 'DESC';

        let query =    `SELECT users_session_records.id AS user_id, webpage_id, url, total_time_in_millisec, users_session_records.created_at AS created_at
                        FROM users_session_records 
                        LEFT JOIN webpages ON users_session_records.webpage_id = webpages.id
                        WHERE webpage_id = ?
                        ORDER BY users_session_records.created_at ${orderBy}`;
        let result = await this.executeQuery(query, [id], profiler);

        // convert time and date to other format
        for (let i = 0; i < result.length; i++)
        {
            // convert date to local time
            result[i].created_at = (new Date(result[i].created_at)).toLocaleString();

            // convert time in millisec to HH:MM:SS format
            let timeHours = result[i]['total_time_in_millisec'] / (60 * 60 * 1000); //convert from millisec to hours
            let timeMinutes = (timeHours % 1) * 60; // convert hours to minutes
            let timeSeconds = (timeMinutes % 1) * 60; // convert minutes to seconds

            timeHours = Math.floor(timeHours);
            timeMinutes = Math.floor(timeMinutes);
            timeSeconds = Math.ceil(timeSeconds);

            let timeHoursStr = timeHours < 10 ? `0${timeHours}` : timeHours;
            let timeMinutesStr = timeMinutes < 10 ? `0${timeMinutes}` : timeMinutes;
            let timeSecondsStr = timeSeconds < 10 ? `0${timeSeconds}` : timeSeconds;

            let timeFormatted = `${timeHoursStr}:${timeMinutesStr}:${timeSecondsStr}`;

            result[i]['time'] = timeFormatted;
        }

        return result;
    }

    // check if the webpage is in the database
    async isWebpage(url, profiler = null)
    {
        url = xssFilters.inHTMLData(url);
        return await this.executeQuery(`SELECT id FROM webpages WHERE url = ?`, [url], profiler, true);
    }

    // get the id of the webpage
    async getWebpageID(url, profiler = null)
    {
        url = xssFilters.inHTMLData(url);

        let result = await this.isWebpage(url, profiler);

        if (result)
        {
            return result;
        }

        return await this.addWebpage(url, profiler);
    }

    // add webpage and return the ID if success
    async addWebpage(url, profiler = null)
    {
        url = xssFilters.inHTMLData(url);
        let query = `INSERT INTO webpages (url, created_at, updated_at) VALUES (?, NOW(), NOW())`;
        return await this.executeQuery(query, [url], profiler);
    }

    // add the user session events to the database
    async addUserSessionRecord(data, profiler = null)
    {
        let events = JSON.stringify(data.events);
        let htmlData = JSON.stringify(data.html);
        let totalTime = data.endTime - data.startTime;
        let query = `INSERT INTO users_session_records (webpage_id, html, events, total_time_in_millisec, created_at, updated_at) 
                    VALUES (?,?,?,?, NOW(), NOW())`;
        let value = [data.webpageID, htmlData, events, totalTime];

        // return the ID if success.
        return await this.executeQuery(query, value, profiler);
    }

    // This method will get the html content of the webpage and 
    async getAllUsersEventsByWebpageID(id, profiler = null)
    {
        id = xssFilters.inHTMLData(id);

        // get all the events for the specific webpage
        let query = `SELECT events FROM users_session_records WHERE webpage_id = ?`;
        let result = await this.executeQuery(query, [id], profiler);
        let htmlData = await this.executeQuery(`SELECT html FROM users_session_records WHERE webpage_id = ? LIMIT 1`, [id], profiler, true);
        let htmlResult = JSON.parse(htmlData.html);
        let eventsArr = [];
        let clickEventsLocation = [];
        
        // parse all the results to JSON and push to array eventsArr
        for (let i = 0; i < result.length; i++)
        {
            eventsArr.push(JSON.parse(result[i].events));
        }

        // this will get all the location of the click events
        for (let i = 0; i < eventsArr.length; i++)
        {
            for (let j = 0; j < eventsArr[i].length; j++)
            {
                if (eventsArr[i][j].type == 'click')
                {
                    clickEventsLocation.push({ 
                        x: eventsArr[i][j].x, 
                        y: eventsArr[i][j].y 
                    });
                }
            }
        }
        
        return {clickEventsLocation: clickEventsLocation, html: htmlResult};
    }
}

module.exports = new SessionReplaySocket();