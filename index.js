// index.js

// Load plugins
var hapiModule = require('hapi');
var mysqlModule = require('mysql');
var requestModule = require('request');
var validatorModule = require('validator');
var seneca = require('seneca')();
// var senecaMySQL = require('seneca-mysql-store');
var senecaDynamoDB = require('seneca-dynamo-store');


// Load project libraries and configuration
var config = require('./config.js');
var Callback = require('./lib/callback.js');
var exportData = require('./lib/export-data.js');
var mysqlTools = require('./lib/mysql-tools.js');
var Synchronize = require('./lib/synchronize.js');
var HealthyCheck = require('./lib/healthy-check.js');
var errorCollector = require('./lib/error-collector.js');

var mysqlConnection;

seneca.use(senecaDynamoDB, config.database.dynamodb);

// Create a server with a host and port
var server = new hapiModule.Server();
server.connection({ host: '0.0.0.0', port: process.env.PORT || 3000 });

// Set up error tracker
errorCollector.setRequestModule(requestModule);
errorCollector.setHostname(server.info.uri);
errorCollector.setTargetUrl(config.errorTracker.url);



// Set up export data
// files that need it , now require it
// exportData.setRequestModule(requestModule);
// exportData.setHostname(server.info.uri);
// exportData.setTargetUrl(config.exportData.url);

// Connect to MySQL
mysqlTools.setErrorCollector(errorCollector);
mysqlConnection = mysqlTools.connectToMysql(mysqlModule, config);

// Set handler params
handlerParams = {
    errorCollector: errorCollector,
    seneca: seneca,
    validatorModule: validatorModule
};
callback = new Callback(handlerParams);
// callback.init(handlerParams);

// Configure healthy check
healthyParams = {
    seneca: seneca
};
healthyCheck = new HealthyCheck(healthyParams);

// Set handler params
synchronizeParams = {
    errorCollector: errorCollector,
    seneca: seneca,
    limit: config.synchronize.maxItems
};
synchronize = new Synchronize(synchronizeParams);

// Add the routes and their handlers
server.route({
    method: 'POST',
    path: '/callback',
    handler: callback.handlerSaveCallback
});
server.route({
    method: 'POST',
    path: '/', /* we need this route for legacy reasons, it's the same as POST /callback */
    handler: callback.handlerSaveCallback
});
server.route({
    method: 'GET',
    path: '/healthy-check',
    handler: healthyCheck.handlerHealthyCheck
});
server.route({
	method: 'GET',
	path: '/sync',
	handler: synchronize.handlerSync
});

// Start server
seneca.ready( function(){
    server.start(function () {
        console.log('Server started at: ' + server.info.uri);
    });
});
