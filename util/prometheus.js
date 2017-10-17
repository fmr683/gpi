/**
 * Newly added requires
 */
var Register = require('prom-client').register;  
var Counter = require('prom-client').Counter;  
var Histogram = require('prom-client').Histogram;  
var Summary = require('prom-client').Summary;  
var ResponseTime = require('response-time');  
var namespace = "";

/**
 * A Prometheus counter that counts the invocations of the different HTTP verbs
 * e.g. a GET and a POST call will be counted as 2 different calls
 */
module.exports.numOfRequests = numOfRequests = new Counter({  
    name: pNameSpace + 'numOfRequests',
    help: 'Number of requests made',
    labelNames: ['method','path']

});

/**
 * A Prometheus counter that counts the invocations with different paths
 * e.g. /foo and /bar will be counted as 2 different paths
 */
module.exports.pathsTaken = pathsTaken = new Counter({  
    name: pNameSpace + 'pathsTaken',
    help: 'Paths taken in the app',
    labelNames: ['path']
});

/**
 * A Prometheus summary to record the HTTP method, path, response code and response time
 */
module.exports.responses = responses = new Summary({  
    name: pNameSpace + 'responses',
    help: 'Response time in millis',
    labelNames: ['method', 'path', 'status','error','content'],
    namespace: pNameSpace
});

/**
 * This funtion will start the collection of metrics and should be called from within in the main js file
 */
module.exports.startCollection = function () {  
    //Logger.log(Logger.LOG_INFO, `Starting the collection of metrics, the metrics are available on /metrics`);
    require('prom-client').collectDefaultMetrics();
};

/**
 * This function increments the counters that are executed on the request side of an invocation
 * Currently it increments the counters for numOfPaths and pathsTaken
 */
module.exports.requestCounters = function (req, res, next) {  
    if (req.path != '/metrics') {
        numOfRequests.inc({ method: req.method, path: req.path  });
        pathsTaken.inc({ path: req.path });
    }
    next();
}

/**
 * This function increments the counters that are executed on the response side of an invocation
 * Currently it updates the responses summary
 */
module.exports.responseCounters = ResponseTime(function (req, res, time) {  
    if(req.url != '/metrics') {

        /* Capture the application error if appended to the response */
        var error = null
        if (res.app_error != undefined) {
            error = res.app_error.message
        }

        var req_content = null
        if (res.req_content != undefined) {
            req_content = res.req_content
        }

        var req_path = null
        if (req.route != undefined) {
            req_path =  req.route.path
        }

        var req_method = null
        if (req.method != undefined) {
            req_method = req.method
        }

        responses.labels(req_method, req_path, res.statusCode, error, req_content).observe(time);
    }
})

/**
 * In order to have Prometheus get the data from this app a specific URL is registered
 */
module.exports.injectMetricsRoute = function (App) {  
    App.get('/metrics', (req, res) => {
        res.set('Content-Type', Register.contentType);
        res.end(Register.metrics());
    });
};