var driverController = require('./servers/webdriver-controller'), // ChromeDriver and Selenium
    mockServer = require('./servers/mock-server');                // The mocked backend service
require('./servers/webserver-controller');                        // Starts the web site service

var by = driverController.by;

describe('my app', function () {
    // Clear any previously loaded mocked responses
    beforeEach(mockServer.clear);

    describe('sector-component', function () {

        var driver;
        beforeEach(function () {
            // Set the un-filtered list of sectors to return
            mockServer.get("/getSectors?name=", [sector({ name: "Sector-1" }), sector({ name: "Sector-2" }), sector({ name: "Sector-3" }), sector({ name: "Sector-4" })]);
            // Navigate to the home page and wait for some chart bars to appear
            driver = driverController.get('', 'sector-component .chart .bar');
        });

        it('should display all sectors', function (done) {
            getBars(driver)
                .then(function (bars) {
                    // 8 bars (two per sector)
                    expect(bars.length).toEqual(8);
                })
                .then(done);
        });
        
        it('should list subset of sectors when filtering', function (done) {
            mockServer.get("/getSectors?name=test", [sector({ name: "Sector-2" }), sector({ name: "Sector-4" })]);

            // Type something in the filter box
            driver.findElement(by.css("investment-filter input")).sendKeys("test");

            // Wait until there are only two bars (ajax request completed)
            driver.wait(function () {
                return getBars(driver).then(function (bars) {
                    return bars.length == 4;
                });
            }, 5000);

            getBars(driver)
                .then(function (bars) {
                    expect(bars.length).toEqual(4);
                })
                .then(done);

        });

        // Helper function for getting bars
        var getBars = function (driver) {
            return driver.findElements(by.css('sector-component .chart .bar'));
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
});
