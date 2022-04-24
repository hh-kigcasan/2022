
const Strings = require("./strings");

class Form_Validation{
    
    constructor(config,data){

        this.config = config;
        this.data = data;
        this.rules = [];
        this.message = [];

    }

    run(){

        for(let index in this.config){

            this.rules = Strings.explode_string(this.config[index].rules,"|");   
    
            for(let index2 in this.rules){
           
                this.check_rules(this.rules[index2],this.data[this.config[index].name],this.config[index].label,this.data);
               
            }

        }

        return this;

    }

    check_rules(property,value,label,data){

        property = Strings.explode_string(property,"-");
    
        switch(property[0]){
    
            case "required": 
    
                if(value.length == 0) {
                    this.message.push( " "+label+ " is required"+" ");
                }
    
            break;
    
            case "min_length": 
    
            if(value.length < property[1]) {
                this.message.push(" "+label+ " length must be "+property[1]+" ");
            }
            
            break;

            case "match": 
          
            if(value != data[property[1]]) {
                this.message.push(" "+label+ " must match with "+property[1]+" ");
            }
            
            break;

            case "email": 
    
            let regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if(!regEx.test(value)){
                this.message.push(" "+label+ " is invalid"+" ");
            }
            
            break;

            case "integer":

            if(isNaN(value)){
                this.message.push( " "+label+ " is must be numeric"+" ");
            }

            break
        }
    
    }
    
}

module.exports = Form_Validation; 


