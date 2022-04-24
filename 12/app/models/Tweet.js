const Database = require("../libraries/query-model");

class Tweet {
    async storeTopics(topics){
        let query = "INSERT INTO topics (topics, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING id";
        let values = [JSON.stringify(topics)]
        let id = await Database.executeQuery(query, values);
        return id;
    }
    async getTopics(time){
        let query = `SELECT * FROM topics WHERE created_at <= (NOW() - INTERVAL '${time} hour')`;
        let result = await Database.getRecord(query);
        return result;
    }
}

module.exports = new Tweet;