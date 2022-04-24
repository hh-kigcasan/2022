const routes = [];

routes["/"] = "Users";
routes["/login"] = "Users";
routes["/signin"] = "Users/signin"; 
routes["/register"] = "Users/register"; 
routes["/process"] = "Users/process"; 
routes["/Users/edit"] = "Users/edit";
routes["/update_user_info"] = "Users/update_user_info";
routes["/update_user_password"] = "Users/update_user_password";
routes["/logout"] = "Users/sign_out";
routes["/dashboard"] = "Charts";
routes["/charts/new"] = "Charts/new";
routes["/charts/save"] = "Charts/save";
routes["/charts/update"] = "Charts/update";
routes["/charts/download/:id"] = "Charts/download";
routes["/charts/edit/:id"] = "Charts/edit";
routes["/users/system"] = "Users/system";


module.exports =  routes;

