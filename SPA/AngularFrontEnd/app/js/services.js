'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('testSPA.services', [])
  .service('searchModel', function SearchModel() {
      this.name = '';

      this.json = function () {
          return {
              name: this.name
          };
      };
  })
  .service('backEndServer', ["$http", function ($http) {

      this.analysis = function (params) {
          return $http.get('http://localhost:54361/analysis?name=' + params.name);
      };

      this.getSectors = function (params) {
          return $http.get('http://localhost:54361/getSectors?name=' + params.name);
      };

      this.getTransactions = function (params) {
          return $http.get('http://localhost:54361/getTransactions?name=' + params.name);
      };

      this.getInvestment = function (params) {
          return $http.get('http://localhost:54361/getInvestment?id=' + params.id);
      };
  }]);
