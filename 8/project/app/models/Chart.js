const Form_Validation = require("../libraries/form_validation");
const Mysql = require("../libraries/mysql");
const PDFDocument = require('pdfkit');
const Fs = require('fs');

Mysql.connect();

class Chart{

    get_all_chart(){
        let query = "Select * from charts";
        return Mysql.query(query,[]);
    }

    get_Chart_record(id){
        let query = "Select * from charts where id = ?";
        return Mysql.query(query,[id]);
    }

    save_chart(title,user_id){
        let query = "INSERT INTO charts(title,user_id,created_at,updated_at) ";
        query += "VALUES (?,?,NOW(),NOW())";

        let values = [title,user_id];
      
        return Mysql.query(query,values);
    }

    update_chart(title,data,user_id,autokey){
        let query = "update charts SET title = ?, data = ?, updated_at = NOW() ";
        query += " where user_id = ? and id = ? ";

        let values = [title,data,user_id,autokey];
      
        return Mysql.query(query,values);
    }

    validate_new_chart(data,user_id){

        return new Promise ((resolve,reject) =>{
            let config = [
                {label:"title",     name:"title",           rules:"required" },
            ]
            let form_validation =  new Form_Validation(config,data);
            let validation = form_validation.run().message;
          
            if(validation.length == 0){
                let result = this.save_chart(data.title,user_id);

                result.then((result) =>{
                    resolve(result);
                })
                .catch((error) => { 
                    reject(error);
                }); 
            }     
            else{
               reject(validation);
            }
        });
    }

    create_pdf(data,autokey){

        let pdfDoc = new PDFDocument({size:"TABLOID",layout: 'landscape'});
        pdfDoc.pipe(Fs.createWriteStream("../project/assets/pdf/"+autokey+".pdf"));
        pdfDoc.text(data.organization);

        if(!Array.isArray(data.name)){
            data.top = parseInt(data.top);
            data.left= parseInt(data.left);
    
            if(data.path.length > 1){           
                pdfDoc.image('../project/assets/images/' + data.path, data.left, data.top, {fit: [50, 50]});
            }
            
            pdfDoc.text(data.name, data.left, data.top+80);
            pdfDoc.text(data.position, data.left, data.top+90);

        }
        else{
            for(let index in data.name){    
                data.top[index] = parseInt(data.top[index]);
                data.left[index] = parseInt(data.left[index]);
                
                if(data.path[index] != undefined){
                    pdfDoc.image('../project/assets/images/' + data.path[index], data.left[index], data.top[index], {fit: [50, 50]});
                }
                
                pdfDoc.text(data.name[index], data.left[index], data.top[index]+80);
                pdfDoc.text(data.position[index], data.left[index], data.top[index]+90);
            }
        }
    
        pdfDoc.end();
    }

    upload_image(files){
        return new Promise ((resolve,reject) =>{
            if(files){

                if(files["myfile"].name != undefined){

                    if(files.length == undefined){
                        this.move_image(files.myfile);
                    }else{
                        for(let index in files.myfile){
                            this.move_image(files.myfile[index]);
                        }
                    }
                }
            }
            resolve("done");
        });
    }

    move_image(file){
       
        let path = "../project/assets/images/" + file.name;
    
        file.mv(path, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}


module.exports = new Chart();