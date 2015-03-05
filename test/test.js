'use strict';

var expect = require('chai').expect;
var AppTracker;

describe('/callback', function() {
    describe('post', function() {
        before(function(done){
            AppTracker = require('../index');
            AppTracker.connection({ host: '0.0.0.0', port: 5555 })
            AppTracker.start(function() {
                console.log('started on: ' + AppTracker.info.uri);
                done();
                });
        });
        it('should accept a single event', function(done) {
            var injectOptions = {
                method: 'POST',
                url: 'http://localhost:' + AppTracker.info.uri + '/callback',
                payload: 'email=test@example.com&timestamp=1390078739&event_list=%5B%7B%22screen_name%22%3A%22Get%20settings%22%2C%22event_name%22%3A%22show.screen.splash.screen%22%2C%22id%22%3A36%2C%22hotel_id%22%3A-1%2C%22city_id%22%3A-1%2C%22timestamp%22%3A1425010784%7D%5D&smtp-id=32131231&category=all',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': '12'
                }
            };
            AppTracker.inject(injectOptions, function (res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(404);
            });
            done();
        });
        
        after(function(){
            AppTracker.stop();
        });
    });
});
