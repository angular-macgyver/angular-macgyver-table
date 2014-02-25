'use strict';

var TableSectionController = function ($scope, $element, $attrs, $animate) {
  this.rowCellTemplates = {};
  this.rowsMap          = {};
  this.rowsOrder        = [];
  this.rowCellsMaps     = {};
  this.rowTemplate      = null;
  this.table            = null;

  var marker = angular.element('<!-- *~* -->');

  $element.append(marker);

  this.getCellTranclude = function (cell) {
    var template, templateName;

    if (cell &&
        cell.column &&
        cell.column.colName in this.rowCellTemplates) {
      templateName = cell.column.colName;
    } else {
      templateName = '?';
    }
    template = this.rowCellTemplates[templateName];
    if (template) return template;
  };

  this.build = function (models) {
    var section;

    if (!this.rowTemplate) return;

    this.table.load($attrs.macTableSection, models);
    $scope.section = section = this.table.sections[$attrs.macTableSection];
    this.buildRows(section.rows);
  };

  this.buildRows = function (rows) {
    /*
     * Build Rows
     */
    var lastRowsMap     = this.rowsMap,
        nextRowsMap     = {},
        lastRowsOrder   = this.rowsOrder,
        nextRowsOrder   = [],
        previousElement = marker;

    angular.forEach(rows, function tableRepeatRows (row, index) {
      var rowId = row.id,
          rowBlock,
          childRowScope;

      // Store the order of the rows so we can compare against them later
      nextRowsOrder.push(rowId);

      // Check if we already have a block for this row
      if (typeof lastRowsMap[rowId] !== 'undefined') {
        nextRowsMap[rowId] = rowBlock = lastRowsMap[rowId];
        delete lastRowsMap[rowId];
        if (lastRowsOrder.indexOf(rowId) === index) {
          console.log('no work!');
          previousElement = rowBlock.clone;
          return;
        }
      } else {
        nextRowsMap[rowId] = rowBlock = {row: row};
      }

      if (rowBlock.scope) {
        childRowScope = rowBlock.scope;
      } else {
        childRowScope = $scope.$new();
        childRowScope.$watchCollection('table.columnsOrder', function watchColumnsOrder (columns) {
          this.buildRowCells(rowBlock.row,
                             rowBlock.clone,
                             rowBlock.scope,
                             columns);
        }.bind(this));
      }

      if (!rowBlock.scope) {
        childRowScope.row = row;
        rowBlock.scope = childRowScope;
        this.rowTemplate(childRowScope, function rowTranscludeCB(clone) {
          $animate.enter(clone, null, previousElement);
          rowBlock.clone = clone;
        });
      } else {
        // Be smarter about this...
        // don't append unless the order has changed
        $animate.move(rowBlock.clone, null, previousElement);
      }

      previousElement = rowBlock.clone;
    }, this);

    // Removed any unused rows and delete them from the rows cells map
    angular.forEach(lastRowsMap, function tableCleanUnusedRows (row, rowId) {
      var cellsMap,
          colName;

      $animate.leave(lastRowsMap[rowId].clone);
      lastRowsMap[rowId].scope.$destroy();
      delete lastRowsMap[rowId];

      // Remove all associated cells
      cellsMap = this.rowCellsMaps[rowId];

      for (colName in cellsMap) {
        cellsMap[colName].clone.remove();
        cellsMap[colName].scope.$destroy();
        delete cellsMap[colName];
      }

      delete this.rowCellsMaps[rowId];
    }, this);

    this.rowsMap   = nextRowsMap;
    this.rowsOrder = nextRowsOrder;
  };

  this.buildRowCells = function (row, rowElement, childRowScope, columns) {
    var cells        = row.cells,
        lastCellsMap = this.rowCellsMaps[row.id] || {},
        nextCellsMap = {};

    angular.forEach(columns, function tableRepeatCells (colName) {
      var cellBlock,
          childCellScope,
          cellTransclude,
          cell = row.cellsMap[colName];

      if (typeof lastCellsMap[colName] !== 'undefined') {
        cellBlock = lastCellsMap[colName];
        delete lastCellsMap[colName];
      } else {
        cellBlock = {};
      }

      if (cellBlock.scope) {
        childCellScope = cellBlock.scope;
      } else {
        // This should probably check for the cell tranclude before making a
        // possibly unneeded scope
        childCellScope = childRowScope.$new();
      }

      if (!cellBlock.scope) {
        childCellScope.cell = cell;
        cellBlock.scope = childCellScope;
        cellTransclude = this.getCellTranclude(cell);
        if (cellTransclude) {
          cellTransclude(childCellScope, function cellTranscludeCB(clone) {
            rowElement[0].appendChild(clone[0]);
            cellBlock.clone = clone;
          });
        }
      } else {
        rowElement[0].appendChild(cellBlock.clone[0]);
      }

      nextCellsMap[colName] = cellBlock;
    }, this);

    angular.forEach(lastCellsMap, function (cell, colName) {
      lastCellsMap[colName].clone.remove();
      lastCellsMap[colName].scope.$destroy();
      delete lastCellsMap[colName];
    }, this);

    this.rowCellsMaps[row.id] = nextCellsMap;
  };
};

module.exports = TableSectionController;
