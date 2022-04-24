const Form_Validation = require("../libraries/form_validation");
const Mysql = require("../libraries/mysql");
Mysql.connect();

class User{

    validate_login(data){

        return new Promise ((resolve,reject) =>{
            let config = [
                {label:"Email Address",     name:"emailLogin",           rules:"required" },
                {label:"Password",          name:"passwordLogin",        rules:"required" },
            ]
            let form_validation =  new Form_Validation(config,data);
            let validation = form_validation.run().message;
          
            if(validation.length == 0){
                resolve("valid");
            }     
            else{
               reject(validation);
            }
        });
    }

    check_user(data){

        let query = "SELECT id,first_name,last_name,user_level,email_address FROM users ";
        query += "WHERE (email_address =?) and password =md5(concat(?,salt))";

        let values = [data.emailLogin,data.passwordLogin];
        return Mysql.query(query,values);
    }

    check_user_email(email){
        return new Promise ((resolve) =>{

        let query  = "SELECT * FROM users WHERE email_address = ?"

        resolve(Mysql.query(query,[email]));
        });
    }

    validate_register(data)
    {
        return new Promise ((resolve,reject) =>{
            let config = [
                {label:"Email Address",               name:"email",             rules:"required|email"},
                {label:"First Name",                  name:"fName",             rules:"required"},
                {label:"Last Name",                   name:"lName",             rules:"required"},
                {label:"Password",                    name:"password",          rules:"required|min_length-8"},
                {label:"Confirm Password",            name:"cPassword",         rules:"required|match-password"},
            ]
            
            
            let form_validation =  new Form_Validation(config,data);
            let validation = form_validation.run().message;
    
            if(validation.length == 0){

                let result_check_email =  this.check_user_email(data.email);   
               
                result_check_email.then((result) =>{

                    if(result.data.length >= 1){
                        reject(["Email Already Exist"]);
                    }
                    else{
                        resolve("valid");
                    }
                });
            }     
            else{
               reject(validation);
            }
        });
    }

    insert_user(data){

        console.log(data);
        let md5 = require("md5");
        let crypto = require("crypto");
       
        let salt = crypto.randomBytes(22).toString('base64');
        
        let encrypted_password = md5(data.password+salt);   
        let query = "INSERT INTO users(first_name,last_name,email_address,salt,password,created_at,updated_at) ";
        query += "VALUES (?,?,?,?,?,NOW(),NOW())";

        let values = [data.fName,data.lName,data.email,salt,encrypted_password];
      
        return Mysql.query(query,values);
    }

    validate_edit_user_info(data,currentEmailAdd){

        return new Promise ((resolve,reject) =>{
            let config = [
                {label:"Email Address",     name:"email",       rules:"required|email" },
                {label:"First Name",        name:"fName",       rules:"required" },
                {label:"Last Name",         name:"lName",       rules:"required" },
            ]
            let form_validation =  new Form_Validation(config,data);
            let validation = form_validation.run().message;

            if(validation.length == 0 && currentEmailAdd == data.email){

                resolve("valid");
            }
            else if(validation.length == 0 && currentEmailAdd != data.email){

                let result_check_email =  this.check_user_email(data.email);   
               
                result_check_email.then((result) =>{

                    if(result.data.length >= 1){
                        reject(["Email Already Exist"]);
                    }
                    else{
                        resolve("valid");
                    }
                }); 
            }     
            else{
                reject(validation);
            }
        });
    }

    update_user_info(user_id,data){

        let query  = "UPDATE users SET email_address = ? , first_name = ? , last_name = ? WHERE id = ?";
        let values = [data.email, data.fName,data.lName,user_id];

        return Mysql.query(query,values);
    }


    validate_edit_user_password(request){

        return new Promise ((resolve,reject) =>{
            let config = [
                {label:"Old Password",               name:"oPassword",       rules:"required|min_length-8" },
                {label:"Password",                   name:"password",        rules:"required|min_length-8" },
                {label:"Confirm Password",           name:"cPassword",       rules:"required|match-password" },
            ]
            let form_validation =  new Form_Validation(config,request.body);
            let validation = form_validation.run().message;

            if(validation.length == 0){
                   
                let result_valid_pass =  this.check_old_password(request.session.user.email_address,request.body.oPassword);   

                result_valid_pass.then((result) =>{

                    if(result.data.length == 0){
                        reject(["old password not same"]);
                    }
                    else{
                        resolve("valid");
                    }
                });
            }     
            else{
                
               reject(validation);
            }
        });
    }

    check_old_password(emailLogin,password){

        return new Promise ((resolve) =>{

        let query = "SELECT id,first_name,last_name,user_level,email_address FROM users ";
        query += "WHERE (email_address =?) and password =md5(concat(?,salt))";

        let values = [emailLogin,password];
        resolve(Mysql.query(query,values));  
        
        });
    }

    update_user_password(password,user_id){

        let md5 = require("md5");
        let crypto = require("crypto");
       
        let salt = crypto.randomBytes(22).toString('base64');
        let encrypted_password = md5(password+salt);   

        let query  = "UPDATE users SET password = ? , salt = ? WHERE id = ?";
        let values = [encrypted_password,salt,user_id];

        return Mysql.query(query,values);
    }


}

module.exports = new User();
