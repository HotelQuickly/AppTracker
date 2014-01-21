exports.database = {
	host: "localhost",
	user: "root",
	password: "",
	database: "apptracker"
};

exports.errorTracker = {
	url: "http://api.hotelquickly.com"
}

exports.healthyCheck = {
	tableName: "app_callback"
}

exports.server = {
	port: 8080
}

exports.exportData = {
	url: "http://backend.hotelquickly.com/import/data"
}
