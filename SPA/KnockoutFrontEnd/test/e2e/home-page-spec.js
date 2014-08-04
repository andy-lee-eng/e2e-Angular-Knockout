var driverController = require('./servers/webdriver-controller'), // ChromeDriver and Selenium
    mockServer = require('./servers/mock-server');                // The mocked backend service
require('./servers/webserver-controller');                        // Starts the web site service

var by = driverController.by;


describe('home page', function () {

    it('should render home when user navigates to /home', function (done) {
        // Load the home page and wait for the panel heading to appear
        var driver = driverController.get('', 'investments-component .panel-heading h3');

        // Check the content of the panel heading
        driver.findElement(by.css('investments-component .panel-heading h3')).getText()
            .then(function (heading) {
                expect(heading).toMatch(/Investments/);
            })
            .then(done);
    });

});
