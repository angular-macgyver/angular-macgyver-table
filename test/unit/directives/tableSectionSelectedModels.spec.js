'use strict';

describe('Table section selected models directive', function () {
  var columns = ['name', 'band', 'instrument'],
      guid = 0,
      models = [
        {id: guid++, name: 'Mick Jagger', band: 'Rolling Stones', instrument: 'vocals'},
        {id: guid++, name: 'Ringo Star', band: 'Beatles', instrument: 'drums'},
        {id: guid++, name: 'Paul McCartney', band: 'Beatles', instrument: 'bass'},
        {id: guid++, name: 'John Lennon', band: 'Beatles', instrument: 'guitar'}
      ],
      triggerKeyDown,
      triggerKeyUp,
      $document,
      $scope,
      $element,
      template;

  triggerKeyDown = function (keycode) {
    var event = $document[0].createEvent('HTMLEvents');
    event.initEvent('keydown', true, true);
    event.which = keycode;

    $document[0].dispatchEvent(event);
  };

  triggerKeyUp = function (keycode) {
    var event = new Event('keyup');
    event.which = keycode;
    $document[0].dispatchEvent(event);
  };

  template = '<table mac-table ' +
                    'mac-table-columns="columns">' +
                '<tbody mac-table-section="body" ' +
                       'mac-table-section-models="models"' +
                       'mac-table-section-selected-models="table.$parent.selectedModels">' +
                  '<tr mac-table-row ' +
                      'ng-class="{isSelected: row.selected}" ' +
                      'mac-table-selectable="true">' +
                    '<td mac-cell-template="">{{cell.column.colName}}</td>' +
                  '</tr>' +
                '</tbody>' + 
             '</table>';

  beforeEach(angular.mock.module('macTable'));

  beforeEach(inject(function ($injector) {
    var $compile = $injector.get('$compile'),
        $rootScope = $injector.get('$rootScope');

    $document = $injector.get('$document');
    $scope = $rootScope.$new();

    $element = $compile(template)($scope);
    $scope.$apply(function () {
      $scope.columns = columns;
      $scope.models = models;
      $scope.selectedModels = [];
    });
  }));

  it('selects a row when clicked', function () {
    var rowElementOne = $element.find('tr').eq(0),
        rowElementTwo = $element.find('tr').eq(3);

    rowElementOne.triggerHandler('click');
    expect($scope.selectedModels.length).toBe(1);
    expect(rowElementOne.attr('class')).toContain('isSelected');

    rowElementTwo.triggerHandler('click');
    expect($scope.selectedModels.length).toBe(1);
    expect(rowElementTwo.attr('class')).toContain('isSelected');

    rowElementTwo.triggerHandler('click');
    expect($scope.selectedModels.length).toBe(0);
  });

  it('selects multiple rows when command it pressed', function () {
    var rowElementOne = $element.find('tr').eq(0),
        rowElementTwo = $element.find('tr').eq(3);

    rowElementOne.triggerHandler('click');
    triggerKeyDown(91);
    rowElementTwo.triggerHandler('click');
    expect($scope.selectedModels.length).toBe(2);

    rowElementTwo.triggerHandler('click');
    expect($scope.selectedModels.length).toBe(1);
  });

  it('selects a range when shift is clicked', function () {
    var rowElementOne  = $element.find('tr').eq(0),
        rowElementFour = $element.find('tr').eq(3);

    rowElementOne.triggerHandler('click');
    triggerKeyDown(16);
    rowElementFour.triggerHandler('click');
    expect($scope.selectedModels.length).toBe(4);

    triggerKeyUp(16);

    rowElementFour.triggerHandler('click');
    triggerKeyDown(16);
    rowElementOne.triggerHandler('click');
    expect($scope.selectedModels.length).toBe(4);
  });
});
