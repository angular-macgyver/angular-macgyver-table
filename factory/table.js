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
  Table = function (columns) {
    this.sections = {};
    this.columnsOrder = [];
    this.columnsMap = {};

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
        sectionModels = [],
        removedRows = [],
        section = this.sections[sectionName],
        models = convertObjectModelsToArray(srcModels),
        i, ii,
        rowIndex,
        row,
        modelIndex,
        model;

    // Loop through the sections current rows
    // if any models matched mark them as removed [1]
    // otherwise, mark them as something to add [2]
    for (i = 0, ii = section.rows.length; i < ii; i++) {
      row = section.rows[i];
      rowIndex = models.indexOf(row.model);
      if (rowIndex === -1) {
        removedRows.push(row); /* [1] */
      } else {
        orderedRows[rowIndex] = row; /* [2] */
        sectionModels[rowIndex] = row.model;
      }
    }

    // Loop over the models passed in
    // if the model hasn't already been added in move on [3]
    // otherwise, create a new row for that model [4]
    for (i = 0, ii = models.length; i < ii; i++) {
      model = models[i];
      if (sectionModels.indexOf(model) === -1) { /* [3] */
        orderedRows[i] = this.newRow(section, model); /* [4] */
      }
    }

    // Replace the rows with our new rows in the correct order [5]
    // then store the removed rows on the section to check against [6]
    section.rows = orderedRows; /* [5] */
    section.removedRows = removedRows; /* [6] */
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
