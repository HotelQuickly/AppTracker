// callback.js

var mysqlConnection;
var errorCollector;
var validatorModule;

exports.setErrorCollector = function(val) {
	errorCollector = val;
}

exports.setMysqlConnection = function(val) {
	mysqlConnection = val;
};

exports.setValidator = function(val) {
	validatorModule = val;
};

exports.handlerSaveCallback = function (request, reply) {
	var post = {
		device_code : request.payload.device_code ? validatorModule.toString(request.payload.device_code) : null,
		tmp_secret_key : request.payload.tmp_secret_key ? validatorModule.toString(request.payload.tmp_secret_key) : null,
		app_secret_key : request.payload.app_secret_key ? validatorModule.toString(request.payload.app_secret_key) : null,
		screen_name : request.payload.screen_name ? validatorModule.toString(request.payload.screen_name) : null,
		event_name : request.payload.event_name ? validatorModule.toString(request.payload.event_name) : null,
		hotel_id : request.payload.hotel_id ? validatorModule.toString(request.payload.hotel_id) : null,
		ins_dt : new Date(),
		ins_process_id : 'node.js'
	};

	var query = mysqlConnection.query('INSERT INTO app_callback SET ?', post,
		function(err, results) {
			if (err) {
				// Save the error
				errorCollector.log(request, err);

				// Close the connection with successful response and send status 503 (server error)
				var errorMsg = 'Error saving callback to database';
			    reply(errorMsg).code(503);
			}
		}
	);

	// Close the connection with successful response
    reply({ 
		status: 'OK'
   	});
};