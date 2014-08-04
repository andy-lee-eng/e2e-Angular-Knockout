'use strict';
var mockServer = require('./servers/mock-server'); // The mocked backend service
require('./servers/webserver-controller');         // Starts the web site service

// Clear any previously loaded mocked responses
beforeEach(mockServer.clear);

describe('transactions-component', function () {

    beforeEach(function () {
        // Set the un-filtered list of transactions to return
        mockServer.get("/getTransactions?name=", [
            transaction({ date: "2010-01-01", amount: 500 }),
            transaction({ date: "2010-06-01", amount: -600 }),
            transaction({ date: "2010-08-01", amount: 100 }),
            transaction({ date: "2012-01-01", amount: -800, valuation: true })
        ]);
    });

    it('should list all transactions', function () {
        browser.get('/#/home');
        expect(getColumns().count()).toEqual(4);

        expect(getColumns('invested').count()).toEqual(2);
        expect(getColumns('returned').count()).toEqual(1);
        expect(getColumns('valuation').count()).toEqual(1);
    });

    it('should list subset of transactions when filtering', function () {
        browser.get('/#/home');
        mockServer.get("/getTransactions?name=test", [transaction({ date: "2010-06-01" }), transaction({ date: "2010-08-01" })]);

        // Type something in the filter box
        element(by.css("investment-filter input")).sendKeys("test");

        expect(getColumns().count()).toEqual(2);
    });

    // Helper function for getting columns
    var getColumns = function (type) {
        return element.all(by.css("transactions-component .chart .column" + (type ? '.' + type : '')));
    };
    // Helper function creates a test transaction object to return from the mock server
    var transaction = function (i) {
        var defaults = { date: "2010-12-31", amount: 500, valuation: false };
        for (var prop in defaults) {
            if (i[prop] === undefined) i[prop] = defaults[prop];
        };

        i.date = i.date + "T00:00:00";
        return i;
    };
});
