var http = require('http'),
    connect = require('connect'),
    serveStatic = require('serve-static');

// Create a web server to serve the static pages of the test target
function ServerController() {
    var port = 8089;
    var app = connect().use(serveStatic('src', { 'index': ['index.html'] }));
    var server = http.createServer(app).listen(port);

    // Hook Jasmine events so we can stop the server at the end
    jasmine.getEnv().addReporter(new ServerReporter(server));
};

// The Reporter class allows us to stop the server at the end
function ServerReporter(server) {
    this.server = server;
}
ServerReporter.prototype = new jasmine.Reporter();

ServerReporter.prototype.reportRunnerResults = function (runner) {
    this.server.close();
};

module.exports = new ServerController();
