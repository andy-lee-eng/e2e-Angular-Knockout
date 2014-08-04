End-to-End testing a Single Page Application using Angular or Knockout
===================

An implementation of the same SPA in both AngularJS and KnockoutJS (with CrossroadsJS and RequireJS), with a suite of end-to-end tests in both solutions.

###Introduction
This is a follow-up project from my [Angular-vs-Knockout](https://github.com/DevAndyLee/Angular-vs-Knockout) project. Here, I have implemented a suite of end-to-end tests in both projects, using a mocked server to improve the robustness of the tests.

###Installation

From both the AngularFrontEnd and KnockoutFrontEnd folders:
```
npm install
```

###Start the servers

Use node to run the back-end server:

```
call node NodeBackEnd\index.js
```

Use the node http server to host the web site locally:

```
call http-server AngularFrontEnd\app –p 8082 -o -c-1
call http-server KnockoutFrontEnd\src –p 8081 -o -c-1
```

###Run the end-to-end tests

####For the Angular project

Run the unit tests from the AngularFrontEnd folder:

```
Protractor test/protractor-conf.js
```

####For the Knockout project

Install [jasmine-node](https://github.com/mhevery/jasmine-node): 

```
npm install jasmine-node -g
```

Install the [Chrome Driver for Selenium](https://code.google.com/p/selenium/wiki/ChromeDriver), and add ChromeDriver to you PATH:

```
SET PATH=%PATH%;C:\....\npm\node_modules\chromedriver\lib\chromedriver
```

Run the unit tests from the KnockoutFrontEnd folder:

```
jasmine-node test/e2e/ --captureExceptions

```
