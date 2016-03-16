var http = require('http');
var crypto = require('crypto')

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
                try {
                    if (err) { throw new Error(); }

                    if (row['passwd_hash'] === parsed_body['passwd_hash']) {
                        var session_token = crypto.randomBytes(128/8).toString('hex');
                        var query_params = [session_token, row['username']];
                        var query = 'update main set session_token=? where username=?';

                        db.run(query, query_params, (err) => {
                            if (err) { throw new Error(); }

                            return res.end(JSON.stringify({valid: true, session_token: session_token}));
                        });
                    }
                    else { throw new Error(); }
                }
                catch (_) {
                    return res.end(JSON.stringify({valid: false}));
                }
            });
        });
    }
});

module.exports = server;
