'use strict';

var ExampleController = [
  '$scope', 
  '$timeout', 
  'Table',
  'TableSectionController',
  function (
    $scope, 
    $timeout,
    Table,
    TableSectionController
  ) {

  var counter = 0;

  $scope.test = 'Hello World';

  $scope.exampleTable = new Table();
  $scope.selectedModels = [];
  $scope.rowData = {};
  $scope.tableColumns = ['name', 'twitter'];
  $scope.exampleTableController = TableSectionController.extend({
    getRows: function () {
      var rows = this.section.rows.slice(0);
      console.log($scope.reverse, $scope.limitStart, $scope.limitEnd);
      if ($scope.reverse) rows.reverse();
      return rows.slice($scope.limitStart || 0, $scope.limitEnd || rows.length);
    }
  });

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

  $scope.$on('macTableLoadedModels:myTable', function () {
    console.log('loaded some models!');
  });

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

  $scope.toggleReverse = function () {
    $scope.reverse = !$scope.reverse;
    $scope.$broadcast('macTableSectionBuildRows');
  };
}];

module.exports = ExampleController;
