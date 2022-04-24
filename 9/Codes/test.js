
const loadtest = require('loadtest');


function statusCallback(error, result, latency) {
    // console.log('Current latency %j, result %j, error %j', latency, result, error);
    console.log('----');
    console.log('Request elapsed milliseconds: ', result.requestElapsed);
    console.log('Request index: ', result.requestIndex);
    console.log('Request loadtest() instance index: ', result.instanceIndex);
}


const options = {
	url: 'https://www.waltermartdelivery.com.ph/',
	maxRequests: 3,
    statusCallback: statusCallback
};

loadtest.loadTest(options, function(error, result)
{
	if (error){
		return console.error('Got an error: %s', error);
	}
	console.log('Tests run successfully');
	console.log(result);
});