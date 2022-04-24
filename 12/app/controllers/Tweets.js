const TweetModel = require("../models/Tweet");
const { TwitterApi } = require("twitter-api-v2");
const Cron = require("node-cron");
const userClient = new TwitterApi({
    appKey: "sB2IpshjE0QPFZ7nWw1a3dasd",
    appSecret: "vg004D1foEFpnLKqPNCLdhIwVxrJY910SyIbSdtce5or4xbBXh",
});
const appOnlyClient = new TwitterApi("AAAAAAAAAAAAAAAAAAAAACOCbgEAAAAAJO%2BqfZ8HOj0A45HngboHHFMnhrc%3DWOVxcKjOaoIhn2POV9CSjyVUke1cwXwA9GcoSDlTUWV7p6LCGD");

class Tweets {
    async index(req, res){
        let topics = [];
        let storeTopics = [];
        const trendsOfCountry = await userClient.v1.trendsByPlace(1);
        Cron.schedule('0 0 */1 * *', async function() {
            for(const { trends } of trendsOfCountry){
                for(const trend of trends){
                    storeTopics.push(trend);
                }
            }
            let result = await TweetModel.storeTopics(storeTopics);
            console.log(result);
            console.log("running a task every hour");
        }); 

        for(const { trends } of trendsOfCountry){
            for(const trend of trends){
                topics.push(trend);
            }
        }
        res.render("index", {title: "Globe", data: topics});
    }
    async getTrends(req, res){
        let topics = [];
        let countryName;
        const currentTrends = await userClient.v1.trendsAvailable();
        for(const { country, parentid } of currentTrends){
            if(req.body.name === country){
                countryName = country;
                const trendsOfCountry = await userClient.v1.trendsByPlace(parentid);
                for(const { trends } of trendsOfCountry){
                    for(const trend of trends){
                        topics.push(trend);
                    }
                }
                break;
            }
        }
        res.render("partials/trends_partials", {data: topics, country: countryName});
    }
    async getTopics(req, res){
        let topics = [];
        topics.push(await TweetModel.getTopics(req.body.time));
        res.render("partials/topics_partials", {data: topics, time: req.body.time});
    }
}

module.exports = new Tweets;