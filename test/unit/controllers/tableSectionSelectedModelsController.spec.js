'use strict';

describe('Table section selected models', function () {
  var TableSectionSelectedModelsController = require('../../../controllers/tableSectionSelectedModelsController'),
      TableSectionController,
      Table,
      table,
      $scope,
      columns = ['name', 'band', 'instrument'],
      models = [
        {name: 'Mick Jagger', band: 'Rolling Stones', instrument: 'vocals'},
        {name: 'Ringo Star', band: 'Beatles', instrument: 'drums'},
        {name: 'Paul McCartney', band: 'Beatles', instrument: 'bass'},
        {name: 'John Lennon', band: 'Beatles', instrument: 'guitar'}
      ],
      controller;

  beforeEach(angular.mock.module('macTable'));

  beforeEach(inject(function ($injector) {
    var $rootScope = $injector.get('$rootScope'),
        $parse = $injector.get('$parse'),
        mockAttrs = {
          macTableSection: 'body',
          macTableSectionSelectedModels: 'selectedModels'
        };

    Table = $injector.get('Table');
    TableSectionController = $injector.get('TableSectionController');
    table = new Table(columns);
    table.load('body', models);
    $scope = $rootScope.$new();

    $scope.$apply(function () {
      $scope.selectedModels = [];
      $scope.models = models;
      $scope.table = table;
    });

    controller = new TableSectionSelectedModelsController($scope, mockAttrs, $parse);
  }));

  it('selects models added to the selected models variable', function () {
    $scope.$apply(function () {
      $scope.selectedModels.push(models[0]);
    });
    expect(table.sections.body.rows[0].selected).toBe(true);

    // Grow selection
    $scope.$apply(function () {
      $scope.selectedModels.push(models[3]);
    });
    expect(table.sections.body.rows[0].selected).toBe(true);
    expect(table.sections.body.rows[3].selected).toBe(true);

    // Shrink selection
    $scope.$apply(function () {
      $scope.selectedModels = [];
    });
    expect(table.sections.body.rows[0].selected).toBe(false);
    expect(table.sections.body.rows[3].selected).toBe(false);
  });

  it('prunes selected models if associated rows are not visible', function () {
    var SectionController = TableSectionController.extend({
      getRows: function () {
        return this.section.rows.slice(0,1);
      }
    });

    $scope.$apply(function () {
      $scope.selectedModels = models;
    });
    expect($scope.selectedModels.length).toBe(4);

    $scope.$apply(function () {
      table.load('body', null, SectionController);
    });
    expect($scope.selectedModels.length).toBe(1);
  });

});
