// callback.js

var mysqlConnection;
var errorCollector;
var validatorModule;

var config = require('../config');

var statsd = require('node-statsd-client').Client;
var statsdClient = new statsd(config.statsd.host, config.statsd.port);

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
	var eventsToInsert = [];
	
	// If it is a request with only one event (&event_list not set)
	// just grab the data from the request.
	// When/if apps conform to the 'event_list' (below) this snippet
	// can be removed completely.
	if( request.payload.event_list == null ){
		var post = {
			device_code    : request.payload.device_code    ? validatorModule.toString(request.payload.device_code)    : null,
			tmp_secret_key : request.payload.tmp_secret_key ? validatorModule.toString(request.payload.tmp_secret_key) : null,
			app_secret_key : request.payload.app_secret_key ? validatorModule.toString(request.payload.app_secret_key) : null,
			screen_name    : request.payload.screen_name    ? validatorModule.toString(request.payload.screen_name)    : null,
			event_name     : request.payload.event_name     ? validatorModule.toString(request.payload.event_name)     : null,
			hotel_id       : request.payload.hotel_id       ? validatorModule.toString(request.payload.hotel_id)       : null,
			ins_dt         : new Date(),
			ins_process_id : 'node.js'
		};

		eventsToInsert.push(post);

	// For a request with multiple events (&event_list set) we go through
	// the list
	} else{
		var events = JSON.parse(request.payload.event_list);

		// The device_code/secret_key does not need to be unique per event
		// so it is grabbed from the request
		for (var i = 0; i < events.length; i++){
			var post = {
				device_code    : request.payload.device_code    ? validatorModule.toString(request.payload.device_code)    : null,
				tmp_secret_key : request.payload.tmp_secret_key ? validatorModule.toString(request.payload.tmp_secret_key) : null,
				app_secret_key : request.payload.app_secret_key ? validatorModule.toString(request.payload.app_secret_key) : null,
				screen_name    : events[i].screen_name          ? validatorModule.toString(events[i].screen_name)          : null,
				event_name     : events[i].event_name           ? validatorModule.toString(events[i].event_name)           : null,
				hotel_id       : events[i].hotel_id             ? validatorModule.toString(events[i].hotel_id)             : null,
				timestamp      : events[i].timestamp            ? validatorModule.toString(events[i].timestamp)            : null,
				ins_dt         : new Date(),
				ins_process_id : 'node.js'
			}
			eventsToInsert.push(post);
		}
	}

	// Go through all events (new entries) 
	for (var i = 0; i < eventsToInsert.length; i++) {

		// increment all events
		statsdClient.increment('nodejs.AppTracker.eventSaved');
		statsdClient.increment('nodejs.AppTracker.event.' + eventsToInsert.event_name);
		statsdClient.increment('nodejs.AppTracker.screen.' + eventsToInsert.screen_name.replace(' ', ''));

		var query = mysqlConnection.query('INSERT INTO app_callback SET ?', eventsToInsert[i],
			function(err, results) {
				// console.log(results);
				if (err) {
					// Save the error
					errorCollector.log(request, err);

					// Close the connection with successful response and send status 503 (server error)
					var errorMsg = 'Error saving callback to database';
				    reply(errorMsg).code(503);
				}
			}
		);
	};

	// Close the connection with successful response
    reply({
		status: 'OK'
   	}).header('Access-Control-Allow-Origin', '*');
};