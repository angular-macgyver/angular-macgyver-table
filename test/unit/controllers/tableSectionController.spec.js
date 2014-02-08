'use strict';

describe('Table section controller', function () {
  var TableSectionController = require('../../../controllers/tableSectionController'),
      tableSectionController,
      Table,
      table,
      columns,
      models,
      $scope,
      $element,
      $rootScope,
      section;

  beforeEach(angular.mock.module('macTable'));

  beforeEach(inject(function ($injector) {
    var $attrs = {macTableSection: 'body'},
        rowTransclude,
        cellTransclude;

    models = [
      {name: 'Mick Jagger', band: 'Rolling Stones', instrument: 'vocals'},
      {name: 'Ringo Star', band: 'Beatles', instrument: 'drums'},
      {name: 'Paul McCartney', band: 'Beatles', instrument: 'bass'},
      {name: 'John Lennon', band: 'Beatles', instrument: 'guitar'}
    ];

    $element = angular.element('<div />');
    $rootScope = $injector.get('$rootScope');
    Table = $injector.get('Table');
    $scope = $rootScope.$new();

    // Setup our table
    columns = ['name', 'band', 'instrument'];
    table = new Table(columns);

    // Create mock transclude methods
    rowTransclude = function ($scope, fn) {
      return fn(angular.element('<row />'));
    };

    cellTransclude = function ($scope, fn) {
      return fn(angular.element('<cell />'));
    };

    tableSectionController =
      new TableSectionController($scope, $element, $attrs);

    // Populate the controller w/ transcludes
    tableSectionController.table = table;
    tableSectionController.rowTemplate = rowTransclude;

    columns.forEach(function (colName) {
      tableSectionController.rowCellTemplates[colName] = cellTransclude;
    });
  }));

  it('builds the correct rows with columns', function () {
    tableSectionController.build(models);
    expect($element.find('row').length).toBe(4);
    expect($element.find('cell').length).toBe(12);

    // Grow
    models.unshift({
      name: 'Keith Richards', instrument: 'guitar', band: 'Rolling Stones'});
    models.unshift({
      name: 'George Harrison', instrument: 'guitar', band: 'Beatles'});
    tableSectionController.build(models);
    expect($element.find('row').length).toBe(6);
    expect($element.find('cell').length).toBe(18);

    // Shrink
    models.pop();
    models.pop();
    tableSectionController.build(models);
    expect($element.find('row').length).toBe(4);
    expect($element.find('cell').length).toBe(12);
  });

  it('uses the same row elements', function () {
    tableSectionController.build(models);
    $element.find('row').eq(0).data('mark', 'row-a');
    $element.find('row').eq(1).data('mark', 'row-b');

    models.reverse();
    tableSectionController.build(models);
    expect($element.find('row').eq(3).data('mark')).toBe('row-a');
    expect($element.find('row').eq(2).data('mark')).toBe('row-b');
  });

  it('uses the same cell elements', function () {
    tableSectionController.build(models[0]);
    $element.find('cell').eq(0).data('mark', 'cell-a');
    $element.find('cell').eq(1).data('mark', 'cell-b');
    $element.find('cell').eq(2).data('mark', 'cell-c');

    columns.reverse();
    table.loadColumns(columns);
    tableSectionController.build(models[0]);
    expect($element.find('cell').eq(2).data('mark')).toBe('cell-a');
    expect($element.find('cell').eq(1).data('mark')).toBe('cell-b');
    expect($element.find('cell').eq(0).data('mark')).toBe('cell-c');
  });

});
