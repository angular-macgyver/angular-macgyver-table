'use strict';

var TableSectionController = function ($scope, $element, $attrs) {
  this.rowCellTemplates = {};
  this.rowsMap = {};
  this.rowCellsMaps = {};
  this.rowTemplate = null;
  this.table = null;

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
    var i, ii,
        j, jj,
        section,
        row,
        rows,
        rowId,
        rowBlock,
        childRowScope,
        nextRowsMap,
        lastRowsMap,
        cell,
        cells,
        cellBlock,
        childCellScope,
        colName,
        cellElement,
        nextCellsMap,
        lastCellsMap,
        cellScope,
        cellTransclude;

    if (!this.rowTemplate) return;

    this.table.load($attrs.macTableSection, models);
    $scope.section = section = this.table.sections[$attrs.macTableSection];
    rows = section.ctrl.getRows();

    lastRowsMap = this.rowsMap;
    nextRowsMap = {};

    for (i = 0, ii = rows.length; i < ii; i++) {
      row = rows[i];
      rowId = row.id;

      if (typeof lastRowsMap[rowId] !== 'undefined') {
        nextRowsMap[rowId] = rowBlock = lastRowsMap[rowId];
        delete lastRowsMap[rowId];
      } else {
        nextRowsMap[rowId] = rowBlock = {};
      }

      if (rowBlock.scope) {
        childRowScope = rowBlock.scope;
      } else {
        childRowScope = $scope.$new();
      }

      if (!rowBlock.scope) {
        childRowScope.row = row;
        rowBlock.scope = childRowScope;
        this.rowTemplate(childRowScope, function rowTranscludeCB(clone) {
          $element[0].appendChild(clone[0]);
          rowBlock.clone = clone;
        });
      } else {
        // Be smarter about this... don't append unless the order has changed
        $element[0].appendChild(rowBlock.clone[0]);
      }

      // Repeat cells
      cells = row.cells;
      lastCellsMap = this.rowCellsMaps[row.id] || {};
      nextCellsMap = {};

      for (j = 0, jj = row.cells.length; j < jj; j++) {
        cell = row.cells[j];
        colName = cell.column.colName;
        this.buildRowCells(
            cell, 
            colName, 
            rowBlock, 
            childRowScope, 
            lastCellsMap, 
            nextCellsMap
        );
      }

      for (colName in lastCellsMap) {
        this.cleanUnusedCellsMap(colName, lastCellsMap);
      }

      this.rowCellsMaps[row.id] = nextCellsMap;
    }

    // Removed any unused rows and delete them from the rows cells map
    for (var key in lastRowsMap) {
      this.cleanUnusedRowsMap(key, lastRowsMap);
    }

    this.rowsMap = nextRowsMap;
  };

  this.cleanUnusedCellsMap = function (colName, cellsMap) {
    cellsMap[colName].clone.remove();
    cellsMap[colName].scope.$destroy();
    delete cellsMap[colName];
  };

  this.cleanUnusedRowsMap = function (rowId, rowsMap) {
    var cellsMap, colName;
    rowsMap[rowId].clone.remove();
    rowsMap[rowId].scope.$destroy();
    delete rowsMap[rowId];
    // Remove all associated cells
    cellsMap = this.rowCellsMaps[rowId];
    for (colName in cellsMap) {
      this.cleanUnusedCellsMap(colName, cellsMap);
    }
    delete this.rowCellsMaps[rowId];
  };

  this.buildRowCells = function (cell, colName, rowBlock, childRowScope, lastCellsMap, nextCellsMap) {
    var cellBlock,
        childCellScope,
        cellTransclude;

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
          rowBlock.clone[0].appendChild(clone[0]);
          cellBlock.clone = clone;
        });
      }
    } else {
      rowBlock.clone[0].appendChild(cellBlock.clone[0]);
    }

    nextCellsMap[colName] = cellBlock;
  };


};

module.exports = TableSectionController;
