// TODO: completely deprecate this file

module.exports = {
	database: {
		dynamodb: {
			keyid: process.env.AWS_KEY_ID,
			endpoint: process.env.ENDPOINT,
			secret: process.env.AWS_SECRET
		},
		tableName: 'app_tracker'
	}
	// errorTracker: {
	// 	url: process.env.'http://api.hotelquickly.com'
	// },
};

// Need to configure a central statsd server for node apps, if statsd / graphite
// is a part of your stack

// exports.statsd = {
// 	host: "localhost",
// 	port: 8125
// }
