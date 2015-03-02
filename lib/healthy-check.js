// healthy-check.js
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
var config = require('../config');

var HealthyCheck = (function(){
	
	function HealthyCheck(params) {
		if (params != null) {
			this.init(params);
    	}
		this.handlerHealthyCheck = __bind(this.handlerHealthyCheck, this);
	}
	
	HealthyCheck.prototype.init = function(params){
		this.seneca = params.seneca;
	};
	
	HealthyCheck.prototype.handlerHealthyCheck = function(request, reply) {
		var hc = this.seneca.make(config.database.tableName);
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
	
	return HealthyCheck;
	
})();

module.exports = HealthyCheck;
