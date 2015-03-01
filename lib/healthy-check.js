// healthy-check.js

var config = require('../config');

var seneca;
var mysqlConnection;
var tableName;

exports.setSenecaReference = function(val) {
	seneca = val;
};

exports.handlerHealthyCheck = function (request, reply) {
	var hc = seneca.make(config.database.tableName);
	hc.list$({ ins_process_id: 'node.js',  limit$: 1 },function(err,list){
			if (err || !list) {
				// Close the connection with successful response and send status 503 (server error)
				var errorMsg = 'Healthy check error: Cannot fetch from table ' + tableName;
			    reply(errorMsg).code(503);
			} else {
				// Close the connection with successful response
				console.log(list);
			    reply({ 
					status: 'OK'
			   	});
			}
	});
};
