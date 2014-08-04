'use strict';
var mockServer = require('./servers/mock-server'); // The mocked backend service
require('./servers/webserver-controller');         // Starts the web site service

// Clear any previously loaded mocked responses
beforeEach(mockServer.clear);
    
describe('investments-component', function () {

    beforeEach(function () {
        // Set the un-filtered list of investments to return
        mockServer.get("/analysis?name=", [investment({ id: 101, name: "Investment-1" }), investment({ id: 102, name: "Investment-2" }), investment({ id: 103, name: "Investment-3" })]);
    });

    it('should list all investments', function () {
        browser.get('/#/home');
        var rows = getRows();
        expect(rows.count()).toEqual(3);

        expect(rows.get(0).all(by.css('td')).get(0).getText()).toEqual("Investment-1");
        expect(rows.get(1).all(by.css('td')).get(0).getText()).toEqual("Investment-2");
        expect(rows.get(2).all(by.css('td')).get(0).getText()).toEqual("Investment-3");
    });

    it('should format properties of investment', function () {
        mockServer.get("/analysis?name=", [investment({ name: "Investment-1", startDate: "2012-12-05T00:00:00", holdingPeriod: 2.3, investedAmount: 1234, returnAmount: 1200, returnOnInvestment: -0.05 })]);
        browser.get('/#/home');

        var row = getRows().get(0).all(by.css('td'));
        expect(row.get(1).getText()).toEqual("05 December 2012");
        expect(row.get(2).getText()).toEqual("2.30");
        expect(row.get(3).getText()).toEqual("£1,234.00");
        expect(row.get(4).getText()).toEqual("£1,200.00");
        expect(row.get(5).getText()).toEqual("-5%");
    });

    it('should list subset of investments when filtering', function () {
        browser.get('/#/home');
        mockServer.get("/analysis?name=test", [investment({ name: "Investment-2" }), investment({ name: "Investment-3" })]);

        // Type something in the filter box
        element(by.css("investment-filter input")).sendKeys("test");

        var rows = getRows();
        expect(rows.count()).toEqual(2);

        expect(rows.get(0).all(by.css('td')).get(0).getText()).toEqual("Investment-2");
        expect(rows.get(1).all(by.css('td')).get(0).getText()).toEqual("Investment-3");
    });
    
    it('should navigate to investment when row is clicked', function () {
        browser.get('/#/home');
        // Click on the investment row
        var rows = getRows();
        rows.get(0).click();

        expect(browser.getLocationAbsUrl()).toMatch("investment/101");
    });

    // Helper function for getting rows
    var getRows = function () {
        return element.all(by.css("investments-component .panel-body tbody tr"));
    };
    // Helper function creates a test investment object to return from the mock server
    var investment = function (i) {
        var defaults = { startDate: "2012-01-01T00:00:00", holdingPeriod: 0, investedAmount: 0, returnAmount: 0, returnOnInvestment: 0 };
        for (var prop in defaults) {
            if (i[prop] === undefined) i[prop] = defaults[prop];
        };

        return i;
    };
});
