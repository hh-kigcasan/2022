const Yaml = require('js-yaml');
const Fs = require('fs');

class Profiler{

    constructor(status){

        this.list = [];

    }

    modify(index, value){

        this.list[index] = value;
    }

    render(index){
        
        return this.list[index];
    }

    middleware(req, res, next){
           
            let profiler_table;
           
            res.locals.profiler = config.profiler;
            res.locals.base_url = config.public_folder;
          
            if(req.session.background == undefined){
                res.locals.background = config.url + "assets/images/bg3.jpg";
            }else{
                res.locals.background = req.session.background;
            }

            if(req.session.color == undefined){
                res.locals.color = "black";
            }else{
                res.locals.color = req.session.color;
            }
           
            if(res.locals.profiler == 0) {
              
                req.profiler = profiler;

                if(req.method == "POST" ){
                    req.profiler("post",JSON.stringify(req.body));
                }
                
                if(req.method == "GET"){
                    req.profiler("get",JSON.stringify(req.params));
                }
                
                req.profiler("session",JSON.stringify(req.session));
                
                profiler_table = { post:req.profiler("post"), get:req.profiler("get"), session:req.profiler("session"), sql:req.profiler("sql") };
            
                res.locals.profiler_details = function(){ // to display and reset the values once it was triggered to display in the html
                    req.profiler("sql","");
                    req.profiler("get","");
                    req.profiler("post","");
                    req.profiler("session","");
                    return profiler_table;
                }
            }   

            next();
    }

    actions(index, msg){

        if(msg == undefined){
            let value = My_Profiler.render(index);
            return value;
        }
        else{
            My_Profiler.modify(index, msg);
        }
    
    }
}

const config = Yaml.load(Fs.readFileSync('./config/application.yml', 'utf8'));
const My_Profiler = new Profiler(config);
const profiler = My_Profiler["actions"];

module.exports = My_Profiler; 


