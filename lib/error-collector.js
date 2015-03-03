"use strict";
// error-collector.js

var requestModule;
var hostname;
var url;

exports.setRequestModule = function(val) {
	requestModule = val;
}

exports.setHostname = function(val) {
	hostname = val;
}

exports.setTargetUrl = function(val) {
	url = val;
}

// Literally currently does nothing
// Leaving in for simplicity sake
// TODO: We need to pick a logging solution

exports.log = function(request, err) {
	var data = {
		hostname: hostname,
		error: err,
		method: request && request.method ? request.method : null,
		path: request && request.path ? request.path : null,
		getData: request && request.query ? request.query : null,
		postData: request && request.payload ? request.payload : null,
		receivedTimestamp: request && request.info && request.info.received ? request.info.received : null,
		headers: request && request.headers ? request.headers : null,
		requestEmpty: request ? false : true,
	};

	requestModule(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
//	    console.log(body) // Print the google web page.
	  }
	})

}
