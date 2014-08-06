var webdriver = require('selenium-webdriver');

function DriverController() {
    // Create and initialise the web driver
    var driver = new webdriver.Builder().
                   withCapabilities(webdriver.Capabilities.chrome()).
                   build();

    // Hook Jasmine events so we can stop the server at the end
    jasmine.getEnv().addReporter(new DriverControllerReporter(driver));;

    this.get = function (path, waitSelector) {
        // navigate to the requested path
        driver.get('http://127.0.0.1:8089' + '/' + path);

        if (waitSelector) {
            // wait for the specified element to be loaded
            driver.wait(function () {
                return driver.isElementPresent(webdriver.By.css(waitSelector));
            }, 1000);
        }

        return driver;
    };

    // Make the selector available
    this.by = webdriver.By;
};

// The Reporter class allows us to stop the server after all jasmine tests
function DriverControllerReporter(driver) {
    this.driver = driver;
}
DriverControllerReporter.prototype = new jasmine.Reporter();

DriverControllerReporter.prototype.reportRunnerResults = function (runner) {
    this.driver.quit();
};

// Export an instance of the driver controller
module.exports = new DriverController();
