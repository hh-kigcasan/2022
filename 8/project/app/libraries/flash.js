class Flash{

    constructor(){
        this.list = [];
    }

    modify(index, value){
        this.list[index] = value;
    }

    render(index){
        return this.list[index];
    }

    middleware(req, res, next){
        req.flash = MyFlash.flash();
        next();
    }

    flash(){

        return function(index, msg){

            if(msg == undefined){
                let value = MyFlash.render(index);
                MyFlash.modify(index, "");
                return value;
            }else{
                MyFlash.modify(index, msg);
            }
        }
    }
    
}

const MyFlash = new Flash();
 
module.exports = MyFlash; 


