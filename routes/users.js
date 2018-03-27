var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var querystring = require('querystring');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//global variable
var ServiceUrl = "http://api.iamgds.com/ota/";

//common function for all request to api
function get_json_request(url, method, access_token, callback){
	request({
	    url: url,
	    method: method,
	    headers:{
	    	'Content-Type': 'application/json',
	    	'access-token': access_token
	    },
	    json: true   // <--Very important!!!  for xml headers: {"content-type": "application/xml"},
	}, function (error, response, body){
		return callback(body);
	});
};

// get access token to access other apis
function get_access_token(callback){
	var params = {
		ClientId : 50,
		ClientSecret : "d66de12fa3473a93415b02494253f088" 
	};
	var url = ServiceUrl.concat('Auth');

	request({
	    url: url,
	    method: 'POST',
	    json: true,   // <--Very important!!!  for xml headers: {"content-type": "application/xml"},
	    body: params
	}, function (error, response, body){
		return callback(body);
	});
}

//get bus list
router.post('/get_bus_list', (req, res) => { 	
	var params = querystring.stringify(req.body);
	var url = ServiceUrl+"Search?"+params;

	//if access token then only proceed
	get_access_token(function(response){
		var access_token = response;
		get_json_request(url, 'GET', access_token, function(response){
			//var clean_data = format_data(response);
			if(response['success'] == true){
				res.json(response);
			}else{
				res.json({"status": false, "message": "Sorry! No result found"});
			}
		});
	})
});

module.exports = router;
