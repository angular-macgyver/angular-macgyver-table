'use strict';

var TableFactory = ["TableSectionController", function (TableSectionController) {
  var Table,
      TableRow = require('../classes/tableRow'),
      TableColumn = require('../classes/tableColumn'),
      TableSection = require('../classes/tableSection'),
      TableCell = require('../classes/tableCell'),
      rowFactory,
      columnFactory,
      sectionFactory,
      cellFactory,
      convertObjectModelsToArray;

  /*
  * Class Factories
  */
  rowFactory = function (section, model) {
    return new TableRow(section, model);
  };

  columnFactory = function (colName) {
    return new TableColumn(colName);
  };

  sectionFactory = function (table, sectionName, Controller) {
    return new TableSection(Controller || TableSectionController, table, sectionName);
  };

  cellFactory = function (row, column) {
    return new TableCell(row, column);
  };

  /*
  * Utility Functions
  */
  convertObjectModelsToArray = function (models) {
    if (models && !angular.isArray(models)) return [models];
    else return models;
  };

  /*
  * Table Class Constructor
  */
  Table = function (columns, modelKey) {
    this.sections = {};
    this.columnsOrder = [];
    this.columnsMap = {};
    this.modelsMap = {};
    this.modelKey = modelKey || 'id';

    this.loadColumns(columns || []);
  };

  /*
   * Load
   *
   * Takes a section name and optionally a models array and or section
   * controller.
   */
  Table.prototype.load = function (sectionName, models, Controller) {
    // If we've been passed a section name that doesn't exist, create it
    if (!this.sections[sectionName]) {
      this.sections[sectionName] = sectionFactory(this, sectionName);
    }
    // If we've been passed a controller, set it as the controller for that
    // section
    if (Controller) {
      this.sections[sectionName].setController(Controller);
    }
    // If we've got models, load them into the section
    if (models) this.loadModels(sectionName, models);

    return this;
  };

  /*
   * Load Models
   *
   * Takes a section name and models array.
   */
  Table.prototype.loadModels = function (sectionName, srcModels) {
    var orderedRows = [],
        lastModelsMap = this.modelsMap,
        nextModelsMap = {},
        section = this.sections[sectionName],
        models = convertObjectModelsToArray(srcModels);

    angular.forEach(models, function (model, index) {
      var modelKeyValue = model[this.modelKey],
          rowIndex;

      if (typeof lastModelsMap[modelKeyValue] === 'undefined') { /* [3] */
        orderedRows[index] = this.newRow(section, model); /* [4] */
      } else {
        rowIndex = lastModelsMap[modelKeyValue];
        orderedRows[index] = section.rows[rowIndex];
      }

      nextModelsMap[modelKeyValue] = index;
    }, this);

    this.modelsMap = nextModelsMap;
    section.rows   = orderedRows;
  };

  /*
   * Load Columns
   *
   * Syncronizes column order and names w/ row cells and order.
   * Optionally can take a new array of columns to update the table.
   */
  Table.prototype.loadColumns = function (srcColumnsOrder) {
    var lastColumnsMap = this.columnsMap,
        i, ii,
        j, jj,
        colName,
        column,
        sectionName,
        section,
        row,
        cells,
        cell;

    // Passing in new columns is optional
    if (srcColumnsOrder) this.columnsOrder = srcColumnsOrder;

    this.columnsMap = {};
    this.columns = [];

    // Create our new columns map and array of columns
    for (i = 0, ii = this.columnsOrder.length; i < ii; i++) {
      colName = this.columnsOrder[i];
      column = lastColumnsMap[colName];

      if (!column) column = columnFactory(colName);

      this.columnsMap[colName] = this.columns[i] = column;
    }

    // Loop through each section, and then each sections rows, and then each
    // rows cells, reorder them based on the columnsOrder, if a cel doesn't
    // exist, add it, if there are extra cells, they will be dropped
    for (sectionName in this.sections) {
      section = this.sections[sectionName];
      for (i = 0, ii = section.rows.length; i < ii; i++) {
        row = section.rows[i];
        cells = [];
        for (j = 0, jj = this.columnsOrder.length; j < jj; j++) {
          colName = this.columnsOrder[j];
          cell = row.cellsMap[colName];
          if (!cell) {
            column = this.columnsMap[colName];
            cell = cellFactory(row, column);
          }
          cells[j] = cell;
        }
        row.cells = cells;
      }
    }
    return this;
  };

  Table.prototype.blankRow = function () {
    return this.columnsOrder.reduce(function (row, colName) {
      row[colName] = null;
      return row;
    }, {});
  };

  Table.prototype.newRow = function (section, model) {
    var row = rowFactory(section, model),
        i, ii,
        colName,
        column,
        cell;

    for (i = 0, ii = this.columnsOrder.length; i < ii; i++) {
      colName = this.columnsOrder[i]; 
      column = this.columnsMap[colName];
      cell = cellFactory(row, column);
      row.cellsMap[colName] = cell;
      row.cells[i] = cell;
    }

    return row;
  };

  Table.prototype.setColumnWidth = function (colName, width) {
    var passedColumn = false,
        prevSiblingLength = 0,
        i, ii,
        lastWidth, 
        column,
        scale;

    for (i = 0, ii = this.columns.length; i < ii; i++) {
      column = this.columns[i];
      if (column.colName === colName) {
        prevSiblingLength += width;
        if (prevSiblingLength >= 100) return;
        passedColumn = true;
        scale = (100 - prevSiblingLength) / (ii - (i + 1));
        column.width = width;
      } else if (passedColumn) {
        column.width = scale;   
      } else {
        prevSiblingLength += column.width || 0;
      }
    }
  };

  Table.prototype.toJSON = function () {
    return {sections: this.sections};
  };

  return Table;
}];

module.exports = TableFactory;
