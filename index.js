// index.js

// Load plugins
var hapiModule = require('hapi');
var requestModule = require('request');
var validatorModule = require('validator');
var seneca = require('seneca')();
// var senecaMySQL = require('seneca-mysql-store');
var senecaDynamoDB = require('seneca-dynamo-store');


// Load project libraries and configuration
var config = require('./config.js');
var Callback = require('./lib/callback.js');
var Synchronize = require('./lib/synchronize.js');
var HealthyCheck = require('./lib/healthy-check.js');

seneca.use(senecaDynamoDB, config.database.dynamodb);

// Create a server with a host and port
var server = new hapiModule.Server();
server.connection({ host: '0.0.0.0', port: process.env.PORT || 3000 });

// Set handler params
handlerParams = {
	seneca: seneca,
	validatorModule: validatorModule
};
callback = new Callback(handlerParams);

// Set healthy check params
healthyParams = {
	seneca: seneca
};
healthyCheck = new HealthyCheck(healthyParams);

// Set handler params
synchronizeParams = {
	seneca: seneca,
	limit: config.synchronize.maxItems
};
synchronize = new Synchronize(synchronizeParams);


// Start server
seneca.ready( function(){
	server.start(function () {
		console.log('Server started at: ' + server.info.uri);
	});
});
