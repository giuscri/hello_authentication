var http = require('http');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./main.db');

var server = http.createServer(function(req, res) {
    if (req.method === 'PUT' && req.url.match(/^\/$/)) {
        var body = '';
        req.on('data', (chunk) => body += chunk);
        req.on('end', () => {
            var parsed_body = JSON.parse(body);
            var query = `select * from main where username='${parsed_body['username']}'`;
            db.get(query, function(err, row) {
                if (err) { /* Do nothing. Yeah!, it's just a test man!! */}

                if (row['passwd_hash'] === parsed_body['passwd_hash']) {
                    return res.end(JSON.stringify({valid: true}));
                }

                return res.end(JSON.stringify({valid: false}));
            });
        });
    }
});

module.exports = server;
