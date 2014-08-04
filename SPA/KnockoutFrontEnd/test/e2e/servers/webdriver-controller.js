var webdriver = require('selenium-webdriver'),
    http = require('http'),
    connect = require('connect'),
    serveStatic = require('serve-static');

function DriverController() {
    var port = 8089;
    var driver;
    var getDriver = function () {
        // If the driver hasn't been created yet, then create it now
        if (!driver) {
            driver = new webdriver.Builder().
                   withCapabilities(webdriver.Capabilities.chrome()).
                   build();

            // Hook Jasmine events so we can stop the server at the end
            jasmine.getEnv().addReporter(new DriverQuiterReporter(driver));
        }
        return driver;
    };

    // Get the webdriver, navigate to the requested path, and wait for the
    // specified element to be loaded
    this.get = function (path, waitCss) {
        driver = getDriver();

        driver.get('http://127.0.0.1:' + port + '/' + path);

        if (waitCss) {
            driver.wait(function () {
                return driver.isElementPresent(webdriver.By.css(waitCss));
            }, 1000);
        }

        return driver;
    };

    this.by = webdriver.By;
};

// The Reporter class allows us to stop the server at the end
function DriverQuiterReporter(driver) {
    this.driver = driver;
}
DriverQuiterReporter.prototype = new jasmine.Reporter();

DriverQuiterReporter.prototype.reportRunnerResults = function (runner) {
    this.driver.quit();
};

module.exports = new DriverController();
