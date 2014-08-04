var driverController = require('./servers/webdriver-controller'), // ChromeDriver and Selenium
    mockServer = require('./servers/mock-server');                // The mocked backend service
require('./servers/webserver-controller');                        // Starts the web site service

var by = driverController.by;

// Clear any previously loaded mocked responses
beforeEach(mockServer.clear);

describe('investments-component', function () {

    var driver;
    beforeEach(function () {
        // Set the un-filtered list of investments to return
        mockServer.get("/analysis?name=", [investment({ id: 101, name: "Investment-1" }), investment({ id: 102, name: "Investment-2" }), investment({ id: 103, name: "Investment-3" })]);
        // Navigate to the home page and wait for some table rows to appear
        driver = driverController.get('', 'investments-component .panel-body tbody tr');
    });

    it('should list all investments', function (done) {
        getRows(driver)
            .then(function (rows) {
                expect(rows.length).toEqual(3);

                expectCell(rows[0], 0, "Investment-1");
                expectCell(rows[1], 0, "Investment-2");
                expectCell(rows[2], 0, "Investment-3");
            })
            .then(done);
    });

    it('should format properties of investment', function (done) {
        mockServer.get("/analysis?name=", [investment({ name: "Investment-1", startDate: "2012-12-05T00:00:00", holdingPeriod: 2.3, investedAmount: 1234, returnAmount: 1200, returnOnInvestment: -0.05 })]);

        getRows(driver)
            .then(function (rows) {
                expectCell(rows[0], 1, "05 December 2012");
                expectCell(rows[0], 2, "2.30");
                expectCell(rows[0], 3, "£1,234.00");
                expectCell(rows[0], 4, "£1,200.00");
                expectCell(rows[0], 5, "-5%");
            })
            .then(done);
    });

    it('should list subset of investments when filtering', function (done) {
        mockServer.get("/analysis?name=test", [investment({ name: "Investment-2" }), investment({ name: "Investment-3" })]);

        // Type something in the filter box
        driver.findElement(by.css("investment-filter input")).sendKeys("test");

        // Wait until there are only two rows (ajax request completed)
        driver.wait(function () {
            return getRows(driver).then(function (rows) {
                return rows.length == 2;
            });
        }, 5000);

        getRows(driver)
            .then(function (rows) {
                expect(rows.length).toEqual(2);

                expectCell(rows[0], 0, "Investment-2");
                expectCell(rows[1], 0, "Investment-3");
            })
            .then(done);

    });

    it('should navigate to investment when row is clicked', function (done) {
        // Click on the investment row
        getRows(driver).then(function (rows) {
                rows[0].click();
            });

        driver.getCurrentUrl().then(function (url) {
            expect(url).toMatch("investment/101");
        })
        .then(done);
    });

    // Helper function for getting rows
    var getRows = function (driver) {
        return driver.findElements(by.css('investments-component .panel-body tbody tr'));
    };
    // Helper function for checking the contents of a cell in a row
    var expectCell = function (row, cellIndex, expectedValue) {
        return row.findElements(by.css('td')).then(function (cells) {
            return cells[cellIndex].getText().then(function (val) {
                expect(val).toEqual(expectedValue);
            });
        });
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
