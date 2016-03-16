var http = require('http');

var server = http.createServer(function(req, res) {
    res.end(JSON.stringify({valid: false}));
});

module.exports = server;
