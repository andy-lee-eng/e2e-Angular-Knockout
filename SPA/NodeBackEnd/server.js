var http = require('http'),
    routes = require('./routes');

module.exports.start = function (port) {
    http.createServer(routes.router).listen(port);
    console.log('Server running on port ' + port);
};
