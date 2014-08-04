'use strict';
var mockServer = require('./servers/mock-server'); // The mocked backend service
require('./servers/webserver-controller');         // Starts the web site service

describe('home page', function () {

    it('should automatically redirect to /home when location hash/fragment is empty', function () {
        browser.get('/');
        expect(browser.getLocationAbsUrl()).toMatch("/home");
    });

    it('should render home when user navigates to /home', function() {
        browser.get('/#/home');

        // Check the content of the panel heading
        expect(element.all(by.css('investments-component .panel-heading h3')).first()
            .getText()).toMatch(/Investments/);
    });

});
