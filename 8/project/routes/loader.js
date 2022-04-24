const Express = require("express");
const Strings = require("../app/libraries/strings");
const Profiler = require('../app/libraries/profiler');

const Routes = require("./routes");
const Router = Express.Router({ mergeParams: true });

let route,controllers = [];

for(let index in Routes){
    
    route = Strings.explode_string(Routes[index],"/");

    if(controllers[route[0]] == undefined){
        controllers[route[0]] = require("../app/controllers/"+route[0]);
    }
   
    if(route[1] == undefined){
        route[1] = "index";
    }

    Router.get(index,Profiler["middleware"],controllers[route[0]][route[1]]);   //change this 
    Router.post(index,Profiler["middleware"],controllers[route[0]][route[1]]);
}

//todo read all files under controlers and for loop method properties
module.exports = Router;





