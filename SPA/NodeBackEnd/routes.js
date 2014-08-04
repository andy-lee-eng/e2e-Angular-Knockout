var url = require("url"),
    queryString = require('query-string'),
    MockServer = require('./mock-server');

var json = function json(request, response, obj) {
    response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
    response.setHeader('Content-Type', 'application/json');

    var responseJSON = JSON.stringify(obj);

    response.end(responseJSON);
    console.log('Responded with ' + responseJSON.substring(0, 50));
};

exports.router = function (request, response) {
    var urlParts = url.parse(request.url);
    var pathname = urlParts.pathname;
    console.log("Request for " + pathname + " received (params: " + urlParts.query + ").");

    var query = queryString.parse(urlParts.query);

    var mockServer = new MockServer();

    if (pathname === '/analysis')
        json(request, response, mockServer.analysis(query.name));
    else if (pathname === '/getSectors')
        json(request, response, mockServer.getSectors(query.name));
    else if (pathname === '/getTransactions')
        json(request, response, mockServer.getTransactions(query.name));
    else if (pathname === '/getInvestment')
        json(request, response, mockServer.getInvestment(parseInt(query.id)));
    else {
        response.writeHead(404);
        response.end('');
    }
};
