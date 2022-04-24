const CONFIG = require('../config/config');

// Class Profiler. Database queries for the Profiler can only get in mysql
class Profiler
{
    // Process the data from request. If the CONFIG.PROFILER is not set to true, call the next callback function
    processData(request, response, next)
    {
        if (CONFIG.PROFILER)
        {
            response.locals.profiler = {};
            response.locals.profiler['get'] = request.query;
            response.locals.profiler['post'] = request.body;
            response.locals.profiler['session'] = {};
            response.locals.profiler['database_queries'] = [];
        }
        
        next();
    }

    // Render the data
    static output(request, response)
    {
        let htmlStr = '';

        /// return callback function
        return function(err, html) 
        {
            // check if the CONFIG.PROFILER is set to true or if there are values in the response.locals.profile and render the data
            if (response.locals.profiler)
            {
                let profiler = response.locals.profiler;
                profiler.session = request.session;

                // loop through all data and create HTML elements
                for (let field in profiler)
                {
                    htmlStr += `
                        <fieldset style="border:1px solid #000;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee;">
                            <legend style="color:#000;">&nbsp;&nbsp;${field.toUpperCase() + ' DATA'}&nbsp;&nbsp;</legend>
                            <table>
                                <tbody>`

                                for (let rowName in profiler[field])
                                {
                                    htmlStr += `
                                    <tr>
                                        <td style="padding:5px;vertical-align:top;color:#900;background-color:#ddd;">${rowName}&nbsp;&nbsp;</td>
                                        <td style="padding:5px;color:#000;background-color:#ddd;">${JSON.stringify(profiler[field][rowName])}</td>
                                    </tr>`
                                }

                                htmlStr += `
                                </tbody>
                            </table>
                        </fieldset>\n`;
                }

                // concatenate the initial response ang the profiler
                response.send(html.split('</body>')[0] + htmlStr + '</body>\n</html>');
            }
            else
            {
                response.send(html);
            }
        }
    }
}

module.exports = Profiler;