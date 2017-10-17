
'use strict';
module.exports = function(app) {	
	app.use('/gdata', require('./api/glocations'));
}
