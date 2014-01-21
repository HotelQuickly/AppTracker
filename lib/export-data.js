// export-data.js

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

exports.post = function(data, success, error) {
	requestModule({
		uri: url,
		method: "POST",
		timeout: 60*1000,
		json: (data ? data : null),
		headers: {
	    	"Content-Type": "application/json"
	    },
		}, function (error, response, body) {
	 		if (!error && response.statusCode == 200) {
	 			// Successful callback
				success();
	  		} else {
	  			error();
	  		}
	  	}
	);
}