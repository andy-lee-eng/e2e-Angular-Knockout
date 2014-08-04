'use strict';
var mockServer = require('./servers/mock-server'); // The mocked backend service
require('./servers/webserver-controller');         // Starts the web site service

describe('about page', function () {

    it('should render about when user navigates to /about', function () {
        browser.get('/#/about');

        // Check the content of the panel heading
        expect(element.all(by.css('.panel-heading h2')).first().getText()).
        toMatch(/About/);
    });

});