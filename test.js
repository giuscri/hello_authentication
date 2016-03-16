var assert = require('assert');
var http = require('http');
var crypto = require('crypto');

var server = require('./server');

describe('server', function() {
    before(function() {
        server.listen(8080);
    });

    it('should authenticate user `usr`', function(done) {
        options = {
            hostname: 'localhost',
            port: 8080,
            method: 'PUT',
            path: '/',
            headers: {'Content-Type': 'application/json'},
        }
        var req = http.request(options, function(res) {
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                assert.deepEqual(JSON.parse(body), {valid: true});
                done();
            });
        });
        var hash = crypto.createHash('md5');
        hash.on('readable', () => {
            var data = hash.read();
            if (data) {
                auth_data = {
                    username: 'usr',
                    passwd_hash: data.toString('hex'),
                };
                req.end(JSON.stringify(auth_data));
            };
        });
        hash.end('passwd');
    });

    after(function() {
        server.close();
    });
});
