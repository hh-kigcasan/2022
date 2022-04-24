const User = require("../models/User");

class Users{
    
    index(request, response){

        let userLogin = request.session.user;
       
        if(userLogin != undefined){
            response.redirect("/dashboard");
        }else{
            response.render("users/login",{message:request.flash("message")});
        }
    }

    register(request, response){
        response.render("users/register",{message:request.flash("message")});
    }

    edit(request, response){
        
        let view_details = [];

        view_details["details"] = request.session.user;
        view_details["message"] = request.flash("message");
        response.render("users/edit",view_details);
    }

    /*
    DOCU: function to check users to login in the system
    OWNER: rcesperanzate
    DATE: 2022-04-09
    */
    async signin(request, response){
       
        let result = "";

        try{
            
            result = await User.validate_login(request.body);
            result = await User.check_user(request.body);

            if(result.data[0] == undefined){
                result = ["invalid user password/email"];
            }else{
                request.session.user = result.data[0];
            }
        }catch(error){
            result = error;
        }finally{
        
            if(request.session.user == undefined){
                request.flash("message",result);
                response.redirect("/login");
            }else{
                response.redirect("/dashboard");
            }
        }
    }

    /*
    DOCU: function to process the registration, if validation are met the requirements it will save it on the database
    OWNER: rcesperanzate
    DATE: 2022-04-09
    */
    async process(request, response){
       
    let result = "";

        try{
            result = await User.validate_register(request.body);
            result = await User.insert_user(request.body);
            request.flash("message", ["User Added Successfully"]);
        }catch(error){
            result = error;
            request.flash("message",result);
        }finally{
            response.redirect("/register");
        }
    }

    async update_user_info(request, response){

        let result = "";
        let currentEmailAdd = request.session.user.email_address;
        let user_id = request.session.user.id;
    
        try{
            result = await User.validate_edit_user_info(request.body,currentEmailAdd);
            result = await User.update_user_info(user_id,request.body);

            request.session.user.email_address = request.body.email;
            request.session.user.first_name = request.body.fName;
            request.session.user.last_name = request.body.lName;
            request.flash("message",["Update Information Saved!"]);
        }catch(error){
            request.flash("message",error)
        }finally{
            response.redirect("/users/edit");
        }
    }

    async update_user_password(request, response){

        let result = "";

        try{
            result = await User.validate_edit_user_password(request);       
            result = await User.update_user_password(request.body.password,request.session.user.id); 
            request.flash("message",["Update Password Saved!"]);
        }catch(error){
            request.flash("message",error)
        }finally{
            response.redirect("/users/edit");
        }
    }

    sign_out(request, response){
        request.session.destroy();
        request.flash("message", "");
        response.redirect("/");
    }

    system(request, response){

        if(request.body.background != undefined){
            request.session.background = request.body.background;
        }else{
            request.session.background = undefined;
        }

        if(request.body.color != undefined){
            request.session.color = request.body.color;
        }else{
            request.session.color = undefined;
        }
    
        response.send("done");
    }
}

module.exports = new Users();


