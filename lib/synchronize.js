// callback.js

var mysqlConnection;
var errorCollector;
var exportData;

var updateSynchronizedFlag = function(results) {
	results.forEach(
		function update(row) {
			mysqlConnection.query('UPDATE app_callback SET synchronized_flag = 1, upd_process_id = "update-sync-flag" WHERE id = ' + row.id);
		}
	);
}

exports.setErrorCollector = function(val) {
	errorCollector = val;
}

exports.setMysqlConnection = function(val) {
	mysqlConnection = val;
};

exports.setExportData = function(val) {
	exportData = val;
}

exports.handlerSync = function (request, reply) {
	var query = mysqlConnection.query('SELECT * FROM app_callback WHERE synchronized_flag = 0 LIMIT 1000',
		function(err, results, fields) {

			if (err || !results) {
				// Close the connection with successful response and send status 503 (server error)
				var errorMsg = 'Healthy check error: Cannot fetch from table "app_callback"';
			    reply(errorMsg).code(503);

			} else if (results.length > 0) {
				// Post the data to the target server
				exportData.post(results, updateSynchronizedFlag(results));

				// Close the connection with successful response
			    reply({ status: 'OK' });
			} else {
				// Close the connection with successful response
			    reply({ status: 'OK' });
			}
		}
	);
};