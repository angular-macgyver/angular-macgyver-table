'use strict';

var ExampleController = ['$scope', function ($scope) {
  $scope.test = 'Hello World';

  $scope.selectedModels = [];
  $scope.rowData = {};
  $scope.tableColumns = ['name', 'twitter'];
  $scope.tableModels = [
    {name: 'Colin Kahn', twitter: '@programmingwtf'},
    {name: 'Adrian Lee', twitter: '@adrianthemole'}
  ];
  $scope.addRow = function (rowData) {
    $scope.tableModels.push(angular.copy(rowData));
  };
  $scope.addRows = function (count) {
    while (count--) {
      $scope.tableModels.push({name: 'blah', twitter: '@blah'});
    }
  };
}];

module.exports = ExampleController;
