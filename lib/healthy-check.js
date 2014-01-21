// healthy-check.js

var mysqlConnection;
var tableName;

exports.setMysqlConnection = function(val) {
	mysqlConnection = val;
};

exports.setTableName = function(val) {
	tableName = val;
};

exports.handlerHealthyCheck = function (request, reply) {
	var query = mysqlConnection.query('SELECT id, ins_dt FROM ' + tableName + ' ORDER BY id DESC LIMIT 1',
		function(err, results, fields) {
			if (err || !results) {
				// Close the connection with successful response and send status 503 (server error)
				var errorMsg = 'Healthy check error: Cannot fetch from table ' + tableName;
			    reply(errorMsg).code(503);
			} else {
				// Close the connection with successful response
			    reply({ 
					status: 'OK'
			   	});
			}
		}
	);
};