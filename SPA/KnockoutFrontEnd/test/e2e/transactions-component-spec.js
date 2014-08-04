var driverController = require('./servers/webdriver-controller'), // ChromeDriver and Selenium
    mockServer = require('./servers/mock-server');                // The mocked backend service
require('./servers/webserver-controller');                        // Starts the web site service

var by = driverController.by;

describe('my app', function () {
    // Clear any previously loaded mocked responses
    beforeEach(mockServer.clear);

    describe('transactions-component', function () {

        var driver;
        beforeEach(function () {
            // Set the un-filtered list of transactions to return
            mockServer.get("/getTransactions?name=", [
                transaction({ date: "2010-01-01", amount: 500 }),
                transaction({ date: "2010-06-01", amount: -600 }),
                transaction({ date: "2010-08-01", amount: 100 }),
                transaction({ date: "2012-01-01", amount: -800, valuation: true })
            ]);

            // Navigate to the home page and wait for some chart columns to appear
            driver = driverController.get('', 'transactions-component .chart .column');
        });

        it('should display all transactions', function (done) {
            getColumns(driver).then(function (columns) {
                    expect(columns.length).toEqual(4);
                });
            getColumns(driver, 'invested').then(function (columns) {
                expect(columns.length).toEqual(2);
            });
            getColumns(driver, 'returned').then(function (columns) {
                expect(columns.length).toEqual(1);
            });
            getColumns(driver, 'valuation').then(function (columns) {
                expect(columns.length).toEqual(1);
            })
            .then(done);
        });

        it('should list subset of transactions when filtering', function (done) {
            mockServer.get("/getTransactions?name=test", [transaction({ date: "2010-06-01" }), transaction({ date: "2010-08-01" })]);

            // Type something in the filter box
            driver.findElement(by.css("investment-filter input")).sendKeys("test");

            // Wait until there are only two columns (ajax request completed)
            driver.wait(function () {
                return getColumns(driver).then(function (columns) {
                    return columns.length == 2;
                });
            }, 5000);

            getColumns(driver)
                .then(function (columns) {
                    expect(columns.length).toEqual(2);
                    done();
                });

        });

        // Helper function for getting columns
        var getColumns = function (driver, type) {
            return driver.findElements(by.css('transactions-component .chart .column' + (type ? '.' + type : '')));
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
});
