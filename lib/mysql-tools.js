// mysql-tools.js

var errorCollector;

exports.setErrorCollector = function(val) {
	errorCollector = val;
}

exports.connectToMysql = function(mysql, config) {
	var mysqlConnection = mysql.createConnection({
		host : config.database.host,
		user : config.database.user,
		password : config.database.password,
		database : config.database.database
	});
	
	mysqlConnection.connect(function(err) {
		if (err) {
			console.log('Error connecting to MySQL');
			console.log(err);

			// Save the error
			errorCollector.log(err);
		}
	});

	// Crash itself in any case of a database error
	// This is good for the 'forever' script => would be restarted quickly
	mysqlConnection.on('error', function(err) {
		console.log('database error', err);
		throw err;
	});

	return mysqlConnection;
}