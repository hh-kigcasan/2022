//REQUIRES
const YAML = require("js-yaml");
const fs = require("fs");

//LOADS THE YAML
const yaml_data = fs.readFileSync("data.yaml");
const data = YAML.load(yaml_data); // .load is now much safer than safeLoad

//START OF CLASS
class Profiler {
    profile(req, res, next) {
        res.locals.profiler = data.enable_profiler;

        if(req.session.body_post == undefined) {
            req.session.body_post = {};
        }
        res.locals.profile_details = {
            post: req.session.body_post,
            query: req.session.query,
            url: req.originalUrl,
            get: req.params,
        };
        next();
    }
}
//END OF CLASS

//INSTANTIATION OF CLASS
let profiler = new Profiler();

//EXPORT IT AS MODULE
module.exports = profiler;