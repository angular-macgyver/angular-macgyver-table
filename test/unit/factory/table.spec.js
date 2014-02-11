'use strict';

describe('Table', function () {
  var Table,
      TableColumn = require('../../../classes/tableColumn'),
      TableSection = require('../../../classes/tableSection'),
      TableRow = require('../../../classes/tableRow'),
      TableCell = require('../../../classes/tableCell');

  beforeEach(angular.mock.module('macTable'));

  beforeEach(inject(function ($injector) {
    Table = $injector.get('Table');
  }));

  describe('constructor', function () {
    it('calls the loadColumns method', function () {
      var loadColumnsSpy = jasmine.createSpy('loadColumns'),
          table;

      Table.prototype.loadColumns = loadColumnsSpy;
      table = new Table();
      expect(loadColumnsSpy).toHaveBeenCalledWith(jasmine.any(Array));
    });
  });

  describe('columns', function () {
    var columns, table;

    beforeEach(function () {
      columns = ['name', 'instrument', 'band'];
      table = new Table(columns);
    });

    it('sets the columns as the current column order', function () {
      expect(table.columnsOrder).toBe(columns);
    });

    it('populates the columns map with TableColumn instances', function () {
      columns.forEach(function (colName) {
        var column = table.columnsMap[colName];
        expect(column instanceof TableColumn).toBe(true);
        expect(column.colName).toBe(colName);
      });
    });

    it('sets the column width', function () {
      table.setColumnWidth('name', 50);
      expect(table.columnsMap.name.width).toBe(50);
      expect(table.columnsMap.instrument.width).toBe(25);
      expect(table.columnsMap.band.width).toBe(25);

      table.setColumnWidth('name', 10);
      expect(table.columnsMap.name.width).toBe(10);
      expect(table.columnsMap.instrument.width).toBe(45);
      expect(table.columnsMap.band.width).toBe(45);
    });
  });

  describe('sections', function () {
    var table;

    beforeEach(function () {
      table = new Table();
    });

    it('creates a new section', function () {
      table.load('body');
      expect(table.sections.body instanceof TableSection).toBe(true);
    });
  });

  describe('section controller', function () {
    var table;

    beforeEach(function () {
      table = new Table();
    });

    it('creates a new controller on the section', function () {
      var Controller = function () {};

      table.load('body', null, Controller);
      expect(table.sections.body.ctrl instanceof Controller).toBe(true);
    });
  });

  describe('rows', function () {
    var table, models;

    beforeEach(function () {
      table = new Table();
      models = [
        {name: 'Mick Jagger'},
        {name: 'Ringo Star'},
        {name: 'Paul McCartney'},
        {name: 'John Lennon'}
      ];
      table.load('body', models);
    });

    it('creates rows for each model', function () {
      expect(table.sections.body.rows.length).toBe(models.length);
      for (var i = 0; i < models.length; i++) {
        expect(table.sections.body.rows[i] instanceof TableRow).toBe(true);
      }
    });

    it('creates them in the order passed in', function () {
      for (var i = 0; i < models.length; i++) {
        expect(table.sections.body.rows[i].model).toEqual(models[i]);
      }
    });

    it('removes rows', function () {
      var prunedModels = models.slice(0,1); 
      table.load('body', prunedModels);
      expect(table.sections.body.rows.length).toBe(1);
      //expect(table.sections.body.removedRows.length).toBe(3);
      expect(table.sections.body.rows[0].model).toBe(prunedModels[0]);
    });

    it('reorders rows', function () {
      var reorderedModels = models.slice(0);
      reorderedModels.reverse();
      table.load('body', reorderedModels);
      for (var i = 0; i < reorderedModels.length; i++) {
        expect(table.sections.body.rows[i].model).toEqual(reorderedModels[i]);
      }
      //expect(table.sections.body.removedRows.length).toBe(0);
    });

    it('creates a blank row', function () {
      var blankRow, columns = ['name', 'instrument', 'band'];
      table.loadColumns(columns);
      blankRow = table.blankRow();
      expect('name' in blankRow).toBe(true);
      expect('instrument' in blankRow).toBe(true);
      expect('band' in blankRow).toBe(true);
    });

  });

  describe('cells', function () {
    var table, models, columns, checkCells;

    checkCells = function (table, columns) {
      for (var i = 0; i < columns.length; i++) {
        expect(table.sections.body.rows[0].cells[i] instanceof TableCell)
          .toBe(true);
        expect(table.sections.body.rows[0].cells[i].column.colName)
          .toBe(columns[i]);
        expect(table.sections.body.rows[0].cellsMap[columns[i]].column.colName)
          .toBe(columns[i]);
      }
    };

    beforeEach(function () {
      columns = ['name', 'instrument', 'band'];
      table = new Table(columns);
      models = [{name: 'John Lennon', instrument: 'Vocals', band: 'Beatles'}];
      table.load('body', models);
    });

    it('creates cells for each column', function () {
      expect(table.sections.body.rows[0].cells.length).toBe(columns.length);
      checkCells(table, columns);
    });

    it('removes cells if the columns change', function () {
      table.loadColumns(['name']);
      expect(table.sections.body.rows[0].cells.length).toBe(1);
      expect(table.sections.body.rows[0].cells[0].column.colName).toBe('name');
    });

    it('reorders cells if column order changes', function () {
      var reorderedColumns = columns.slice(0);
      reorderedColumns.reverse();
      table.loadColumns(reorderedColumns);
      checkCells(table, reorderedColumns);
    });
  });

  it('creates the correct JSON', function () {
    var table, json;

    table = new Table();
    table.load('body');
    json = table.toJSON();

    expect('sections' in json).toBe(true);
    expect(json.sections.body.name).toBe('body');
  });

});
