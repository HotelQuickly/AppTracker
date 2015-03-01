module.exports = {
	database: {
		dynamodb: {
			keyid: process.env.AWS_KEY_ID,
			endpoint: process.env.ENDPOINT,
			secret: process.env.AWS_SECRET
		},
		tableName: 'app_tracker'
	},
	errorTracker: {
		url: 'http://api.hotelquickly.com'
	},
	healthyCheck: {
		tableName: 'app_callback'
	},
	exportData: {
		url: 'http://backend.hotelquickly.com/import/data'
	},
	synchronize: {
		maxItems: 100
	}
};

// Need to configure a central statsd server for node apps, if statsd / graphite
// is a part of your stack

// exports.statsd = {
// 	host: "localhost",
// 	port: 8125
// }
