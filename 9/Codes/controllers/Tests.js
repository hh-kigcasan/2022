const { redirect } = require('express/lib/response');
const loadtest = require('loadtest');


class Tests{

    index(req,res){
        let error_msg = req.flash('error')[0];
        res.render('tests/index', { csrf_token: req.csrfToken(), error_msg: error_msg });
    }

    test(req,res){
        function validURL(str) {
            let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
              '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
              '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return !!pattern.test(str);
        }


        let url = req.body.url;
        let num_request = 10; //default value
        let concurrency = num_request; //default value
        
        if(!validURL(url)){
            req.flash('error', "URL is invalid");
            res.redirect('/');
        }
        
        if(req.body.quantity !== ''){
            num_request = req.body.quantity;
        }

        if(req.body.concurrency !== ''){
            concurrency = req.body.concurrency;
        }

        req.session.url = url;
        req.session.num_request = num_request;
        req.session.concurrency = concurrency;
        res.redirect('/report');
    }

    report(req,res){
        let response_array = [];
        let web_info = "";

        function statusCallback(error, result, latency) {
            // console.log( 'Request Index: ' + result.requestIndex + '   Request elapsed milliseconds: ' + result.requestElapsed);
            web_info = result; 
            response_array.push([`#${result.requestIndex + 1}`, result.requestElapsed]);
        }

        const options = {
            url: req.session.url,
            concurrency: req.session.concurrency,
            maxRequests: req.session.num_request,
            statusCallback: statusCallback
        };

        loadtest.loadTest(options, function(error, result){
            if(error){
                console.error('Got an error: %s', error);
            }
            res.render('tests/report', { result: result , response_array: response_array, url: options.url, web_info: web_info });
        });
    }

}
module.exports = new Tests;
