const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const CONFIG = require('../config/config')

class Redis
{
    // start redis. Run this method before any method.
    start()
    {
        this.redisClient = redis.createClient({legacyMode: true});
        this.redisClient.connect();
        return this;
    }

    // log errors
    onError()
    {
        this.redisClient.on('error', function(err) {
            console.log('Redis error: ', err);
        });
    }

    // This method should not be run before the start method. Return the session values.
    getSessionValues()
    {
        CONFIG.DATABASE_REDIS.client = this.redisClient;
        CONFIG.SESSION_REDIS.store = new redisStore(CONFIG.DATABASE_REDIS);
        return CONFIG.SESSION_REDIS;
    }
}

module.exports = new Redis();