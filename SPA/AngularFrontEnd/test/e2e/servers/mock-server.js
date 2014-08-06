'use strict';
var http = require('http'),
    url = require("url");

// Create a server that responds with pre-set json fragments
function MockServer() {
    var testResponses = [];
    var server = http.createServer(function (request, response) {
        var urlParts = url.parse(request.url);
        var requestPath = urlParts.pathname + urlParts.search;

        // Lookup the mocked response
        var result = [];
        for (var n = 0; n < testResponses.length ; n++) {
            if (testResponses[n].path === requestPath) {
                result = testResponses[n].response;
            }
        }

        // Set the headers and return the result
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(result));
    }).listen(54361);

    // Hook Jasmine events so we can stop the server at the end
    jasmine.getEnv().addReporter(new MockServerReporter(server));

    // Clear the mocked responses
    this.clear = function clear() {
        testResponses = [];
    };

    // Insert a mocked response
    this.get = function get(path, obj) {
        testResponses.push({ path: path, response: obj });
    };
};

// The Reporter class allows us to stop the server at the end
function MockServerReporter(server) {
    this.server = server;
}
MockServerReporter.prototype = new jasmine.Reporter();

MockServerReporter.prototype.reportRunnerResults = function (runner) {
    this.server.close();
};

module.exports = new MockServer();
