'use strict';
var mockServer = require('./servers/mock-server'); // The mocked backend service
require('./servers/webserver-controller');         // Starts the web site service

describe('investment page', function () {

    beforeEach(function () {
        mockServer.get("/getInvestment?id=101", {
            name: "Investment 1", sector: "Sector 1",
            analysis: { returnOnInvestment: 0.35, open: false },
            transactions: [
                { date: "2010-01-01", amount: 500, valuation: false },
                { date: "2012-06-10", amount: -800, valuation: true }
            ]
        });

        browser.get('/#/investment/101');
    });

    it('should display investment details and transactions', function () {
        // Check the content of the panel heading
        expect(element.all(by.css('.panel-heading h2')).first().getText())
            .toMatch("Investment 1");

        // Check the details
        var details = element.all(by.css('.panel-body dl dd'));
        expect(details.get(0).getText()).toEqual("Closed");
        expect(details.get(1).getText()).toEqual("Sector 1");
        expect(details.get(2).getText()).toEqual("35%");

        // Check the transaction details in the table
        var rows = element.all(by.css('.panel-body tbody tr'));

        expect(rows.get(0).all(by.css('td')).get(0).getText()).toEqual("01 January 2010");
        expect(rows.get(0).all(by.css('td')).get(1).getText()).toEqual("£500.00");

        expect(rows.get(1).all(by.css('td')).get(0).getText()).toEqual("10 June 2012");
        expect(rows.get(1).all(by.css('td')).get(1).getText()).toEqual("-£800.00");

        // Check the columns in the chart
        var columns = element.all(by.css(".chart .column"));
        expect(columns.count()).toEqual(2);
    });
});
