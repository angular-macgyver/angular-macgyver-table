'use strict';

var ExampleController = ['$scope', '$timeout', function ($scope, $timeout) {
  var counter = 0;

  $scope.test = 'Hello World';

  $scope.selectedModels = [];
  $scope.rowData = {};
  $scope.tableColumns = ['name', 'twitter'];
  $scope.tableModels = [
    {id: counter++, name: 'Colin Kahn', twitter: '@programmingwtf'},
    {id: counter++, name: 'Adrian Lee', twitter: '@adrianthemole'}
  ];
  $scope.addRow = function (rowData) {
    var data = angular.copy(rowData);
    data.id = counter++;
    $scope.tableModels.push(data);
  };
  $scope.addRows = function (count) {
    while (count--) {
      $scope.tableModels.push({id: counter++, name: 'blah', twitter: '@blah'});
    }
  };

  var quickAddRemoveCount = 0;

  $scope.startQuickAddRemove = function () {
    $scope.quickAddRemovePromise = $timeout(function () {
      if ($scope.tableModels.length) $scope.tableModels = [];
      else $scope.addRows(40);
      if (quickAddRemoveCount < 10) {
        quickAddRemoveCount++;
        $scope.startQuickAddRemove();
      } else {
        quickAddRemoveCount = 0;
      }
    }, 16);
  };
  $scope.stopQuickAddRemove = function () {
    $timeout.cancel($scope.quickAddRemovePromise);
    delete $scope.quickAddRemovePromise;
  };
}];

module.exports = ExampleController;
