// index.js

// Load plugins
var hapiModule = require('hapi');
var mysqlModule = require('mysql');
var requestModule = require('request');
var validatorModule = require('validator');

// Load project libraries and configuration
var config = require('./config.js');
var callback = require('./lib/callback.js');
var exportData = require('./lib/export-data.js');
var mysqlTools = require('./lib/mysql-tools.js');
var synchronize = require('./lib/synchronize.js');
var healthyCheck = require('./lib/healthy-check.js');
var errorCollector = require('./lib/error-collector.js');

var mysqlConnection;

// Create a server with a host and port
// var server = hapiModule.createServer('0.0.0.0', config.server.port, {debug: false});
var server = new hapiModule.Server();
server.connection({ host: '0.0.0.0', port: 4023 /* config.server.port */ });

// Set up error tracker
errorCollector.setRequestModule(requestModule);
errorCollector.setHostname(server.info.uri);
errorCollector.setTargetUrl(config.errorTracker.url);

// Set up export data
exportData.setRequestModule(requestModule);
exportData.setHostname(server.info.uri);
exportData.setTargetUrl(config.exportData.url);

// Connect to MySQL
mysqlTools.setErrorCollector(errorCollector);
mysqlConnection = mysqlTools.connectToMysql(mysqlModule, config);

// Set handler params
callback.setErrorCollector(errorCollector);
callback.setMysqlConnection(mysqlConnection);
callback.setValidator(validatorModule);

// Configure healthy check
healthyCheck.setMysqlConnection(mysqlConnection);
healthyCheck.setTableName(config.healthyCheck.tableName);

// Set handler params
synchronize.setErrorCollector(errorCollector);
synchronize.setMysqlConnection(mysqlConnection);
synchronize.setExportData(exportData);
synchronize.setLimit(config.synchronize.maxItems);

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
server.start(function () {
    console.log('Server started at: ' + server.info.uri);
});
