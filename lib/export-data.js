"use strict";
// export-data.js

var requestModule = require('request');

// params: { url:'', data:'', success: function(), error:function() }
exports.post = function(params) {
	requestModule({
		uri: params.url,
		method: "POST",
		timeout: 60*1000,
		json: (params.data ? params.data : null),
		headers: {
	    	"Content-Type": "application/json"
	    },
		}, function (error, response, body) {
	 		if (!error && response.statusCode == 200) {
	 			// Successful callback
				console.log("success");
				params.success(params.data);
	  		} else {
				console.log("fail");
	  			params.error();
	  		}
	  	}
	);
};
