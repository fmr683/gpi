require('dotenv').config()
var express = require('express');
var request = require('request');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var router = express.Router();
var util = require('util');
var app = require('../config/app');
var db = require('../config/database')
var appExpress = express();


router.post('/get-address', function (req, res) {
  /*  if(app.contentType(req) != 'json'){
    	return res.status(400).json({status: false, message: "failed", result: "Request contentType is not json"});
	}*/
	
	req.checkBody('address', 'Invalid address').notEmpty();

	var errors = req.validationErrors();

	if(errors){
    	return res.status(400).json({status: false, message: "failed", result: errors});
	}

	var address = "";

	if (process.env.ADDRESS == 1) {
		address = req.body.address;
	}

	request.get(
		globalJs.urls().googleMapApi + 'geocode/json?address=' + address + '&sensor=false&units=metric&mode=driving',
		function (error, response, body) {
		//	console.log(json_decode(body.result));
			if (!error && response.statusCode == 200) {
				return res.status(200).json(JSON.parse(body));
			} else {
				res.status(500).json({result: error});
			}
		}
	);

});

router.post('/get-route', function (req, res) {
	/*  if(app.contentType(req) != 'json'){
		  return res.status(400).json({status: false, message: "failed", result: "Request contentType is not json"});
	  }*/
	  
	  requestBodyValidatorPoint(req)
  
	  var errors = req.validationErrors();
  
	  if(errors){
		  return res.status(400).json({status: false, message: "failed", result: errors});
	  }
  
	  var origin = "";
	  var destination = "";

	  if (process.env.ROUTE == 1) {
		var start_lat = req.body.start_lat;
		var start_lon = req.body.start_lon;
		var end_lat = req.body.end_lat;
		var end_lon = req.body.end_lon;
		origin = start_lat + ',' + start_lon;
		destination = end_lat + ',' + end_lon;
	  }
  
	  request.get(
		  globalJs.urls().googleMapApi + 'directions/json?origin=' + origin + '&destination='+ destination  + '&sensor=false&units=metric&mode=driving',
		  function (error, response, body) {
		  //	console.log(json_decode(body.result));
			  if (!error && response.statusCode == 200) {
				  return res.status(200).json(JSON.parse(body));
			  } else {
				  res.status(500).json({result: error});
			  }
		  }
	  );
  
  });


  router.post('/fetch-location', function (req, res) {
	/*  if(app.contentType(req) != 'json'){
		  return res.status(400).json({status: false, message: "failed", result: "Request contentType is not json"});
	  }*/
	  
	  requestBodyCurrentValidatorPoint(req)
  
	  var errors = req.validationErrors();
  
	  if(errors){
		  return res.status(400).json({status: false, message: "failed", result: errors});
	  }
  
	  var origin = ""
	  if (process.env.LOCATION == 1) {
		var start_lat = req.body.start_lat;
		var start_lon = req.body.start_lon;
		origin = start_lat + ',' + start_lon;
	  }

	  request.get(
		globalJs.urls().googleMapApi + 'geocode/json?address=' + origin + '&sensor=false&units=metric&mode=driving',
		  function (error, response, body) {
		  //	console.log(json_decode(body.result));
			  if (!error && response.statusCode == 200) {
				  return res.status(200).json(JSON.parse(body));
			  } else {
				  res.status(500).json({result: error});
			  }
		  }
	  );
  });

 /*appExpress.use(express.static(__dirname + '../views'));
router.get('/', function (req, res) {
	console.log(process.env.ADDRESS);
	//console.log(__dirname  )
	res.sendFile(path.join(__dirname+'/../views/form.html'));
   //__dirname : It will resolve to your project folder.
});

router.post('/', function (req, res) {
	
   //console.log(process.env.ADDRESS)
   console.log(process.env.ADDRESS);
   if (req.body != undefined) {
		process.env['ADDRESS'] = (req.body.address !== undefined ? 1 : '');
		process.env['ROUTE'] = (req.body.route !== undefined ? 1 : '');
		process.env['LOCATION'] = (req.body.location !== undefined ? 1 : '');
		
   }

   console.log(process.env.ADDRESS);
   console.log(process.env.ROUTE);
   console.log(process.env.LOCATION);
   res.sendFile(path.join(__dirname+'/../views/form.html'));
  //__dirname : It will resolve to your project folder.
});

 
router.get('/', function(req, res){
	console.log("dsfjl")
	res.render('form');
});

appExpress.set('view engine', 'pug');
appExpress.set('views', './views');
*/


function requestBodyValidatorPoint(req){
	req.checkBody('start_lat', 'Invalid start latitude').notEmpty().isDecimal().withMessage("start lat should be Decimal");
	req.checkBody('start_lon', 'Invalid end lonitude').notEmpty().isDecimal().withMessage("start lon should be Decimal");
	req.checkBody('end_lat', 'Invalid start latitude').notEmpty().isDecimal().withMessage("end lat should be Decimal");
	req.checkBody('end_lon', 'Invalid end lonitude').notEmpty().isDecimal().withMessage("end lon should be Decimal");
}


function requestBodyCurrentValidatorPoint(req){
	req.checkBody('start_lat', 'Invalid start latitude').notEmpty().isDecimal().withMessage("start lat should be Decimal");
	req.checkBody('start_lon', 'Invalid end lonitude').notEmpty().isDecimal().withMessage("start lon should be Decimal");
}


function requestBodyValidator(req){
	var errorMessage = "";
	if(req.body.id == undefined) errorMessage = errorMessage+"you have to pass id \n";
	if(!app.isInt(req.body.id)) errorMessage = errorMessage+"Id must be integer \n";
	if(req.body.location == undefined) errorMessage = errorMessage+"you have to pass location property";
	return errorMessage;
}


module.exports=router;