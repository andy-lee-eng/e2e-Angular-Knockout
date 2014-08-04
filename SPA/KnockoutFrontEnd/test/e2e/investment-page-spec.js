var driverController = require('./servers/webdriver-controller'), // ChromeDriver and Selenium
    mockServer = require('./servers/mock-server');                // The mocked backend service
require('./servers/webserver-controller');                        // Starts the web site service

var by = driverController.by;

describe('investment page', function () {

    var driver;
    beforeEach(function () {
        mockServer.get("/getInvestment?id=101", {
            name: "Investment 1", sector: "Sector 1",
            analysis: { returnOnInvestment: 0.35, open: false },
            transactions: [
                { date: "2010-01-01", amount: 500, valuation: false },
                { date: "2012-06-10", amount: -800, valuation: true }
            ]
        });

        // Load the investment page and wait for some table rows to appear
        driver = driverController.get('#investment/101', '.panel-body tbody tr');
    });

    it('should display investment details and transactions', function (done) {
        // Check the content of the panel heading
        driver.findElement(by.css('.panel-heading h2')).getText()
            .then(function (heading) {
                expect(heading).toMatch("Investment 1");
            });

        // Check the details
        driver.findElements(by.css('.panel-body dl dd')).then(function (details) {
            details[0].getText().then(function (t) { expect(t).toEqual("Closed"); });
            details[1].getText().then(function (t) { expect(t).toEqual("Sector 1"); });
            details[2].getText().then(function (t) { expect(t).toEqual("35%"); });
        });

        // Check the transaction details in the table
        driver.findElements(by.css('.panel-body tbody tr')).then(function (rows) {

            expectCell(rows[0], 0, "01 January 2010");
            expectCell(rows[0], 1, "£500.00");

            expectCell(rows[1], 0, "10 June 2012");
            expectCell(rows[1], 1, "-£800.00");
        });

        // Check the columns in the chart
        driver.findElements(by.css(".chart .column")).then(function (columns) {
            expect(columns.length).toEqual(2);
        })
            .then(done);
    });

    // Helper function for checking the contents of a cell in a row
    var expectCell = function (row, cellIndex, expectedValue) {
        return row.findElements(by.css('td')).then(function (cells) {
            return cells[cellIndex].getText().then(function (val) {
                expect(val).toEqual(expectedValue);
            });
        });
    };

});
