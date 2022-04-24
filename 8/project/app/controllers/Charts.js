const Chart = require("../models/Chart");
class Charts{
    
    async index(request, response){
        let result = await Chart.get_all_chart();
        response.render("charts/main",{message:request.flash("message"),details:result.data});
    }

    new(request, response){
        response.render("charts/new",{message:request.flash("message")});
    }

    async edit(request, response){
        let result = await Chart.get_Chart_record(request.params.id);
        response.render("charts/edit",{message:request.flash("message"),details:result.data[0]});
    }

    async update(request, response){
       
        let title = request.body.title;
        let user_id = request.session.user.id;
        let result, display_message = "";

        let data = {organization:request.body.title,
                    name:request.body["name[]"],
                    position:request.body["position[]"], 
                    top:request.body["top[]"],
                    left:request.body["left[]"],
                    level:request.body["level[]"],
                    child:request.body["child-id[]"],
                    parent:request.body["parent-id[]"],
                    path:request.body["path[]"]
                    };

        let data_string = JSON.stringify(data);
              
        try{
	        await Chart.upload_image(request.files);
            result = await Chart.update_chart(title,data_string,user_id,request.body.autokey);  
            display_message = ["record save"];  
        }catch(error){
            console.log(error);
            display_message = error;
        }finally{
            Chart.create_pdf(data,request.body.autokey);
            response.send(display_message);
        }
    }

    async save(request, response){
    
        let callback,result,user_id = request.session.user.id;

        try{
            result = await Chart.validate_new_chart(request.body,user_id);
            request.flash("message",["record save"]);
            callback = "/charts/edit/"+result.data.insertId;
        }catch(error){
            callback ="/charts/new";
            request.flash("message",error);
        }finally{
            response.redirect(callback);
        }        
    }

    download(request, response){
        let file = `./assets/pdf/`+ request.params.id + ".pdf";
        response.download(file); 
    }
}

module.exports = new Charts();