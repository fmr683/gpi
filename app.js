global.pNameSpace = "app_rec_api_"
global.client = require('prom-client');

var express = require('express');
var app = express();
global.request =  require('request');
global.globalJs = require('./config/globals');
global.env = require('./config/env');

/** Start Prometheus middleware */
/**
 * This creates the module that we created in the step before.
 * In my case it is stored in the util folder.
 */

var Prometheus = require('./util/prometheus')
//Prometheus.setApiName("app_geo_api_count")

/**
 * The below arguments start the counter functions
 */
app.use(Prometheus.requestCounters);  
app.use(Prometheus.responseCounters);

/**
 * Enable metrics endpoint
 */
Prometheus.injectMetricsRoute(app);

/**
 * Enable collection of default metrics
 */
Prometheus.startCollection();
/** End Prometheus middleware */


require('./config/express')(app);
require('./routes')(app);

// module.exports = app;

app.listen(env.PORT,function(){
	console.info(' server is running on '+env.PORT);
});

 //npm install pg --save
//recomended pickuppoint