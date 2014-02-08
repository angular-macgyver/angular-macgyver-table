'use strict';

describe('Table section blank row directive', function () {
  var columns = ['name', 'band', 'instrument'],
      $scope,
      $element,
      template;

  template = '<table mac-table ' +
                    'mac-table-columns="columns">' +
                '<tbody mac-table-section="body" ' +
                       'mac-table-section-blank-row>' +
                  '<tr mac-table-row>' +
                    '<td mac-cell-template="">{{cell.column.colName}}</td>' +
                  '</tr>' +
                '</tbody>' + 
             '</table>';

  beforeEach(angular.mock.module('macTable'));

  beforeEach(inject(function ($injector) {
    var $compile = $injector.get('$compile'),
        $rootScope = $injector.get('$rootScope');

    $scope = $rootScope.$new();

    $element = $compile(template)($scope);
    $scope.$apply(function () {
      $scope.columns = columns;
    });
  }));

  it('adds a single row', function () {
    expect($element.find('tr').length).toBe(1);
    expect($element.find('td').length).toBe(3);
  });
});
