'use strict';

describe('Table section models directive', function () {
  var columns = ['name', 'band', 'instrument'],
      guid = 0,
      models = [
        {id: guid++, name: 'Mick Jagger', band: 'Rolling Stones', instrument: 'vocals'},
        {id: guid++, name: 'Ringo Star', band: 'Beatles', instrument: 'drums'},
        {id: guid++, name: 'Paul McCartney', band: 'Beatles', instrument: 'bass'},
        {id: guid++, name: 'John Lennon', band: 'Beatles', instrument: 'guitar'}
      ],
      $scope,
      $element,
      template;

  template = '<table mac-table ' +
                    'mac-table-columns="columns">' +
                '<tbody mac-table-section="body" ' +
                       'mac-table-section-models="models">' +
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
      $scope.models = models;
    });
  }));

  it('adds a row for each model', function () {
    expect($element.find('tr').length).toBe(4);

    // Grow
    $scope.$apply(function () {
      $scope.models.unshift({
        id: guid++,
        name: 'Keith Richards',
        instrument: 'guitar',
        band: 'Rolling Stones'
      });
      $scope.models.unshift({
        id: guid++,
        name: 'George Harrison',
        instrument: 'guitar',
        band: 'Beatles'
      });
    });
    expect($element.find('tr').length).toBe(6);

    // Shrink
    $scope.$apply(function () {
      $scope.models.pop();
      $scope.models.pop();
    });
    expect($element.find('tr').length).toBe(4);
  });

  it('rerenders columns even if models do not change', function () {
    var checkColumnOrder = function ($rowElement) {
      var colName, i;
      for (i = 0; i < $scope.columns.length; i++) {
        colName = $scope.columns[i];
        expect($rowElement.find('td').eq(i).text()).toContain(colName);
      }
    };

    checkColumnOrder($element.find('tr').eq(0));
    $scope.$apply(function () {
      $scope.columns.reverse();
    });
    checkColumnOrder($element.find('tr').eq(0));
  });
});
