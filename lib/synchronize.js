// callback.js
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
var config = require('../config');
var exportData = require('./export-data.js');
var async = require('async');



var Synchronize = (function(){
	
	function Synchronize(params) {
		console.log(config.database.tableName);
		if (params != null) {
			this.init(params);
    	}
		this.handlerSync = __bind(this.handlerSync, this);
		this.updateSynchronizedFlag = __bind(this.updateSynchronizedFlag, this);
		this.persistFlagChange = __bind(this.persistFlagChange, this);
	}
	
	Synchronize.prototype.init = function(params) {
		this.errorCollector = params.errorCollector;
		this.limit = params.limit;
		this.seneca = params.seneca;
	};
	
	Synchronize.prototype.persistFlagChange = function(eventToChange, callback) {
		var cb = this.seneca.make(eventToChange);
		cb.synchronized_flag = 1;
		cb.save$(function(err,cb) {
			if (err) {
				callback(err);
			} else {
				// statsdClient.increment('nodejs.AppTracker.eventSaved');
				// statsdClient.increment('nodejs.AppTracker.event.' + cb.event_name);
				// if ( cb.screen_name ){
				// 	statsdClient.increment('nodejs.AppTracker.screen.' + cb.screen_name.replace(' ', ''));
				// }
				callback();
			}
		});
	};
	
	Synchronize.prototype.updateSynchronizedFlag = function(results) {
		
		async.each(results, this.persistFlagChange, function(err) {
			console.log(err);
		});
		
	};
	
	Synchronize.prototype.postFailed = function() {
		// error log here eventually
	};
	
	Synchronize.prototype.handlerSync = function(request, reply) {
		var toSync = this.seneca.make(config.database.tableName);
		
		var senecaHandler = function(err,results){
			if (err || !results) {
				// Close the connection with status 503 (server error)
				var errorMsg = 'Healthy check error: Cannot fetch from table "app_callback"';
			    reply(errorMsg).code(503);
			} else {
				
				if (results.length > 0) {
					// TODO: See why we aren't returning JSON to the
					// device making the sync request and letting it
					// handle the data instead of posting to it

					// Post the data to the target server
					var postParams = {
						url: config.exportData.url,
						data: results,
						success: this.updateSynchronizedFlag,
						error: this.postFailed
					};
					exportData.post(postParams);
				}
				// Close the connection with successful response
			    reply({ status: 'OK' });
			}
		}
		
		senecaHandler = __bind(senecaHandler, this);
		
		// Get the data
		toSync.list$({ synchronized_flag: 0, limit$: this.limit }, senecaHandler);
	};
	
	return Synchronize;
	
})();

module.exports = Synchronize;
