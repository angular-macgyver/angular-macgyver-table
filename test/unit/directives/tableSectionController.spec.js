'use strict';

describe('Table section controller directive', function () {
  var columns = ['name'],
      TableSectionController,
      Controller,
      $scope,
      $element,
      template;

  template = '<table mac-table ' +
                    'mac-table-columns="columns">' +
                '<tbody mac-table-section="body" ' +
                       'mac-table-section-blank-row ' +
                       'mac-table-section-controller="controller">' +
                  '<tr mac-table-row>' +
                    '<td mac-cell-template="">{{cell.value()}}</td>' +
                  '</tr>' +
                '</tbody>' + 
             '</table>';

  beforeEach(angular.mock.module('macTable'));

  beforeEach(inject(function ($injector) {
    var $compile = $injector.get('$compile'),
        $rootScope = $injector.get('$rootScope');

    TableSectionController = $injector.get('TableSectionController');
    Controller = TableSectionController.extend({
      cellValue: function (row, colName) {
        return '--' + colName + '--';
      }
    });

    $scope = $rootScope.$new();

    $element = $compile(template)($scope);
    $scope.$apply(function () {
      $scope.columns = columns;
      $scope.controller = Controller;
    });
  }));

  it('uses the new controller', function () {
    expect($element.find('td').text()).toBe('--name--');
  });
});
