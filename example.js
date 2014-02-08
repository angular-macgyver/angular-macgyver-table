'use strict';
require('./bower_components/angular/angular');
require('./index');

angular.module('macTable')
  .controller("ExampleController",
      require('./controllers/exampleController'));
