'use strict';
// callback.js
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

var extend = require('util')._extend;
var async = require('async');
var config = require('../config');

var Callback = (function() {
	// 'Class' constructor
	function Callback(params) {
		if (params != null) {
			this.init(params);
    	}
	}
	
	Callback.prototype.init = function(params) {
		this.errorCollector = params.errorCollector;
		this.seneca = params.seneca;
		this.validatorModule = params.validatorModule;
		// The following two methods need the scope of 'this', bound to them
		// Since during callback 'this' is hapi or some such thing.
		this.handlerSaveCallback = __bind(this.handlerSaveCallback, this);
		this.persistEvent = __bind(this.persistEvent, this);
	}
	
	Callback.prototype.constructEventToInsert = function(request) {
		var post = {
			device_code       : request.device_code    ? this.validatorModule.toString(request.device_code)    : null,
			tmp_secret_key    : request.tmp_secret_key ? this.validatorModule.toString(request.tmp_secret_key) : null,
			app_secret_key    : request.app_secret_key ? this.validatorModule.toString(request.app_secret_key) : null,
			screen_name       : request.screen_name    ? this.validatorModule.toString(request.screen_name)    : null,
			event_name        : request.event_name     ? this.validatorModule.toString(request.event_name)     : null,
			hotel_id          : request.hotel_id       ? this.validatorModule.toString(request.hotel_id)       : null,
			timestamp         : request.timestamp      ? this.validatorModule.toString(request.timestamp)      : null,
			synchronized_flag : 0,
			ins_dt            : new Date(),
			ins_process_id    : 'node.js'
		};
		console.log("REQUEST IS:", JSON.stringify(request));
		return post;
	};
	
	Callback.prototype.persistEvent = function(eventToInsert, callback) {
		var cb = this.seneca.make(config.database.tableName, eventToInsert);
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
	
	Callback.prototype.handlerSaveCallback = function (request, reply) {
		var eventsToInsert = [];
		var persistEvent;
		
		// If it is a request with only one event (&event_list not set)
		// just grab the data from the request.
		// When/if apps conform to the 'event_list' (below) this snippet
		// can be removed completely.
		if( request.payload.event_list == null ){
			var post = this.constructEventToInsert(request.payload);
			eventsToInsert.push(post);
		// For a request with multiple events (&event_list set) we extend the payload
		// with the parsed event list and send it to our tiny factory
		} else{
			var events = JSON.parse(request.payload.event_list);
			var extendedPayload = extend(request.payload, events);
			var post = this.constructEventToInsert(extendedPayload)
			eventsToInsert.push(post);
		}
		
		async.each(eventsToInsert, this.persistEvent, function(err){
			if ( err ) {
				this.errorCollector.log(request, err);
				var errorMsg = 'Error saving callback to database';
				reply(errorMsg).code(503);
			} else {
			    reply({ status: 'OK' }).header('Access-Control-Allow-Origin', '*');
			}
		});

	};
	
	return Callback;
})();

module.exports = Callback;
