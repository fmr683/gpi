var express = require('express');
var request = require('request');
var router = express.Router();
var util = require('util');
var app = require('../config/app');
var db = require('../config/database')


router.post('/get-address', function (req, res) {
  /*  if(app.contentType(req) != 'json'){
    	return res.status(400).json({status: false, message: "failed", result: "Request contentType is not json"});
	}*/
	
	req.checkBody('address', 'Invalid address').notEmpty();

	var errors = req.validationErrors();

	if(errors){
    	return res.status(400).json({status: false, message: "failed", result: errors});
	}

	var address = req.body.address;

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
  
	  var start_lat = req.body.start_lat;
	  var start_lon = req.body.start_lon;
	  var end_lat = req.body.end_lat;
	  var end_lon = req.body.end_lon;
	  var origin = start_lat + ',' + start_lon;
	  var destination = end_lat + ',' + end_lon;
  
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
  
	  var start_lat = req.body.start_lat;
	  var start_lon = req.body.start_lon;
	  var origin = start_lat + ',' + start_lon;

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