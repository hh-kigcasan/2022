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

    static adjust_chart(level){

        for(let index in this.list[level]){
            let parent_id = this.list[level][index].getAttribute("data-parent-id");
            let child_id =this.list[level][index].getAttribute("data-child-id")
            let p_Left_loc = $("#"+ parent_id).position().left;
            this.list[level][index].style.left = ( (p_Left_loc-125) + (child_id*320) )+ "px";
        }
    }

    static update_position(){
        let path = "../../assets/images/";
        
        for(let index in this.list){
           for(let i = 0; i < this.list[index].length; i++){
                 let id = this.list[index][i].getAttribute("id");
                
                 let element = $("#"+ id);
                 element.children("input#top").val(element.position().top);
                 element.children("input#left").val(element.position().left);
                 element.children("input#level").val(this.list[index][i].getAttribute("data-level"));
                 element.children("input#child-id").val(this.list[index][i].getAttribute("data-child-id")); 
                 element.children("input#parent-id").val(this.list[index][i].getAttribute("data-parent-id"));

                 if(element.children("input#myfile")[0].files[0] != undefined){
                    element.children("img#image").attr("src",path + element.children("input#myfile")[0].files[0].name);
                 }  
           }
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

    static decodeHTML(html){
        let txt = document.createElement('textarea');
        txt.innerHTML = html;
        return JSON.parse(txt.value);
    }
}

class Charts{

    constructor(element, level = 1, parent_id = "origin" , data = []){

        this.level = level;
        this.parent = element;
        this.parent_width = $("#" + this.parent).width();
       
        if(parent_id != "origin"){
            this.left = $("#"+ parent_id).position().left;
        }
        else{
            this.left =  (this.parent_width/2) - 125;
        }

        if(data.length == 0){
            data.name = "";
            data.position = "";
        }

        this.top = (100*(level-1) + 200);
        this.image = "<img id = \"image\" src = \"../../assets/images/default.png\" alt = \"employee_image\">";
        this.elementName = "<p><label>Name</label><input id = 'name' name = 'name[]' type = \"text\" value = '"+ data.name +"'></p>";
        this.elemenPosition = "<p><label>Position</label><input name = 'position[]' type = \"text\" value = '"+ data.position +"'></p>";
        this.elemenUpload = "<input type = \"file\" id = \"myfile\"  name = \"myfile\">";
        this.elemenActions = "<button type=\"button\" class = \"add\">Add</button><button class = \"remove\">Remove</button>";
        this.hiddenInput = "<input  id = 'top' name = 'top[]' type = \"hidden\">";
        this.hiddenInput += "<input  id = 'left' name = 'left[]' type = \"hidden\">";
        this.hiddenInput += "<input  id = 'level' name = 'level[]' type = \"hidden\">";
        this.hiddenInput += "<input  id = 'child-id' name = 'child-id[]' type = \"hidden\">";
        this.hiddenInput += "<input  id = 'parent-id' name = 'parent-id[]' type = \"hidden\">";
        this.hiddenInput += "<input  id = 'path' name = 'path[]' type = \"hidden\" value = '"+ data.path +"'>";
       
        this.chart = document.createElement("div");
        this.chart.className = "chart";
        this.chart.setAttribute("data-level",level);
        this.chart.setAttribute("data-child-id",Organization.get_count(level));
        this.chart.setAttribute("data-parent-id",parent_id);
        this.chart.id = this.chart.getAttribute("data-child-id")+"_"+level;
        
    }

    create_input(){
        this.chart.innerHTML = this.image + this.elementName + this.elemenPosition + this.elemenActions + this.elemenUpload + this.hiddenInput ;
        this.chart.style.left = this.left + "px";
        this.chart.style.top = this.top + "px";
        document.getElementById(this.parent).appendChild(this.chart);
        Organization.add_node(this.chart,this.level);
        
        $(".chart").draggable();
        return this;
    }

    display_input(top,left,path){
        if(path == undefined){
            path = "default.png";
        }
        this.image = "<img id = \"image\" src = \"../../assets/images/"+path+"\" alt = \"employee_image\">";
        this.chart.innerHTML = this.image + this.elementName + this.elemenPosition + this.elemenActions + this.elemenUpload + this.hiddenInput ;
        this.left = left;
        this.top = top;
        this.chart.style.left = this.left + "px";
        this.chart.style.top = this.top + "px";
        document.getElementById(this.parent).appendChild(this.chart);
        Organization.add_node(this.chart,this.level);
        
        $(".chart").draggable();
        return this;
    }
}

$(document).on("click",".chart .add", function(){ 
    let level = parseInt($(this).parent().attr("data-level"));
    let obj = new Charts("container",level+1,$(this).parent().attr("id")).create_input();  
});

$(document).on("click",".chart .remove", function(){ 
    Organization.remove($(this));
});

$(document).on("change","#myfile", function(event){ 
    $(this).siblings("input#path").val(event.target.files[0].name);
});




