'use strict';

describe('Table directive', function () {
    var columns = ['name', 'band', 'instrument'],
    Table,
    template,
    $scope,
    $element,
    $tableScope;

  template = '<table mac-table mac-table-columns="columns"></table>';

  beforeEach(angular.mock.module('macTable'));

  beforeEach(inject(function ($injector) {
    var $compile = $injector.get('$compile'),
        $rootScope = $injector.get('$rootScope');

    Table = $injector.get('Table');

    $scope = $rootScope.$new();
    $element = $compile(template)($scope);

    $scope.$apply(function () {
      $scope.columns = columns;
    });

    $tableScope = $scope.$$childHead;
  }));

  it('adds a table instance on scope', function () {
    expect($tableScope.table instanceof Table).toBe(true);
  });

  it('adds the columns to the table', function () {
    expect($tableScope.table.columns.length).toBe(3);
    $scope.$apply(function () {
      $scope.columns.pop();
    });
    expect($tableScope.columns.length).toBe(2);
  });
});
