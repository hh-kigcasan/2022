const express = require('express');
const path = require('path');
const fs = require('fs');

class Router
{
    routes()
    {
        const router = express.Router();

        // get all files in the routes folder
        const routesFolder = path.join(__dirname, '../config/routes');
        const routesFiles = fs.readdirSync(routesFolder);

        // create routes based on the declarations in routes files.
        for (let i in routesFiles)
        {
            router.use(require(path.join(`./${routesFolder}/${routesFiles[i]}`)));
        }
        
        return router;
    }
}

module.exports = (new Router).routes();