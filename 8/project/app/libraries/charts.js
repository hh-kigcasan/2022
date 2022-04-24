let jsdom = require('jsdom');
let DOM;
$ = require('jquery')(new jsdom.JSDOM().window);

class Organization{

    static list = [];

    static add_node(object,level){

        if(this.list[level] == undefined){
            this.list[level] = [];
        }
    
        this.list[level].push(object);
       
    }

    static get_count(level){
        
        if(this.list[level] == undefined){
            return 0;
        }
        else{
            return this.list[level].length;
        }
    }

    static adjust_charts(level){

        for(let index in this.list[level]){
    
           
            let parent_id = this.list[level][index].getAttribute("data-parent-id");
            let child_id =this.list[level][index].getAttribute("data-child-id")
            let p_Left_loc = $("#"+ parent_id).position().left;
            this.list[level][index].style.left = ( (p_Left_loc-125) + (child_id*320) )+ "px";
        }
    }

    static remove(obj){
        let level = $(obj).parent().attr("data-level");
        let child = $(obj).parent().attr("data-child-id");
        
        if(level > 1){
            for(let i = child; i < this.list[level].length; i++ ){
                this.list[level][i] =  this.list[level][i+1];
            }
    
            this.list[level].pop();
            $(obj).parent().remove();

        }
    }
}

class Charts{

    constructor(element, level = 1, parent_id = ""){

        this.level = level;
        this.parent = element;
        this.parent_width = $("#" + this.parent).width();
        this.left =  (this.parent_width/2) - 125;
        this.top = (200*(level-1));
        this.elementName = "<p><label>Name</label><input type = \"text\"></p>";
        this.elemenPosition = "<p><label>Position</label><input type = \"text\"></p>";
        this.elemenActions = "<button class = \"add\">Add</button><button class = \"remove\">Remove</button>";
        this.chart = DOM.window.document.createElement("div");
        this.chart.className = "chart";
        this.chart.setAttribute("data-level",level);
        this.chart.setAttribute("data-child-id",Organization.get_count(level));
        this.chart.setAttribute("data-parent-id",parent_id);
        this.chart.id = this.chart.getAttribute("data-child-id")+"_"+level;
    }

    create_input(){
        this.chart.innerHTML = this.elementName + this.elemenPosition + this.elemenActions;
        this.chart.style.left = this.left + "px";
        this.chart.style.top = this.top + "px";
        if(this.level > 1){
            Organization.add_node(this.chart,this.level);
            Organization.adjust_charts(this.level);
        }
        return this;
    }

    static middleware(req, res, next){
        DOM = new jsdom.JSDOM(res.body);
        req.charts = Charts;
        next();
    }

    loader(){
        $(document).on("click",".chart .add", function(){ 
            let level = parseInt($(this).parent().attr("data-level"));
            let obj = new Charts("container",level+1,$(this).parent().attr("id")).create_input();  
        });
        
        $(document).on("click",".chart .remove", function(){ 
            Organization.remove($(this));
        });
        
    }
}


 
module.exports = Charts; 


