'use strict';
var mockServer = require('./servers/mock-server'); // The mocked backend service
require('./servers/webserver-controller');         // Starts the web site service

// Clear any previously loaded mocked responses
beforeEach(mockServer.clear);

describe('sector-component', function () {

    beforeEach(function () {
        // Set the un-filtered list of sectors to return
        mockServer.get("/getSectors?name=", [sector({ name: "Sector-1" }), sector({ name: "Sector-2" }), sector({ name: "Sector-3" }), sector({ name: "Sector-4" })]);
    });

    it('should list all sectors', function () {
        browser.get('/#/home');
        // 8 bars (two per sector)
        expect(getBars().count()).toEqual(8);
    });
    
    it('should list subset of sectors when filtering', function () {
        browser.get('/#/home');
        mockServer.get("/getSectors?name=test", [sector({ name: "Sector-2" }), sector({ name: "Sector-4" })]);

        // Type something in the filter box
        element(by.css("investment-filter input")).sendKeys("test");

        expect(getBars().count()).toEqual(4);
    });

    // Helper function for getting bars
    var getBars = function () {
        return element.all(by.css("sector-component .chart .bar"));
    };
    // Helper function creates a test sector object to return from the mock server
    var sector = function (i) {
        var defaults = { investedAmount: 1000, returnAmount: 500 };
        for (var prop in defaults) {
            if (i[prop] === undefined) i[prop] = defaults[prop];
        };

        return i;
    };
});
