var driverController = require('./servers/webdriver-controller'), // ChromeDriver and Selenium
    mockServer = require('./servers/mock-server');                // The mocked backend service
require('./servers/webserver-controller');                        // Starts the web site service

var by = driverController.by;

describe('about page', function () {

    it('should render about when user navigates to /about', function (done) {
        // Load the about page and wait for the panel heading to appear
        var driver = driverController.get('#about', '.panel-heading h2');

        driver.findElement(by.css('.panel-heading h2')).getText()
            .then(function (heading) { expect(heading).toMatch(/About/); })
            .then(done);
    });

});
