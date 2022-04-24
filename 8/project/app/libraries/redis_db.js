const Redis = require('redis');
const Session = require('express-session');
const Redis_Store = require('connect-redis')(Session);
const Yaml = require('js-yaml');
const Fs = require('fs');

const db_config = Yaml.load(Fs.readFileSync('./config/database.yml', 'utf8'));

class Redis_DB{

    constructor(host,port){
        
        this.url =  "redis://" + host + ":" + port;
        this.client = "";
        this.store = "";
    }

    connect(){

        this.client = Redis.createClient({ url: this.url, legacyMode: true });
        this.client.connect();

        this.client.on('connect', function(){
            console.log('Redis client connected');
        });
        
        this.client.on('error', (err) => {
            console.log('Redis error: ', err);
        });
    }

    create_store(){

        this.store = new Redis_Store({ client: this.client });
    }
}

module.exports = new Redis_DB(db_config.redis.host,db_config.redis.port);
