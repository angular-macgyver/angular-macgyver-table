'use strict';

var ExampleController = ['$scope', '$timeout', function ($scope, $timeout) {
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
  $scope.startQuickAddRemove = function () {
    $scope.quickAddRemovePromise = $timeout(function () {
      if ($scope.tableModels.length) $scope.tableModels = [];
      else $scope.addRows(50);
      $scope.startQuickAddRemove();
    }, 500);
  };
  $scope.stopQuickAddRemove = function () {
    $timeout.cancel($scope.quickAddRemovePromise);
    delete $scope.quickAddRemovePromise;
  };
}];

module.exports = ExampleController;
