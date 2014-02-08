'use strict';

var TableSectionController = function ($scope, $element, $attrs) {
  this.rowCellTemplates = {};
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

    lastRowsMap = this.rowsMap || {};
    nextRowsMap = {};

    for (i = 0, ii = rows.length; i < ii; i++) {
      row = rows[i];

      if (lastRowsMap.hasOwnProperty(row.id)) {
        nextRowsMap[row.id] = rowBlock = lastRowsMap[row.id];
        delete lastRowsMap[row.id];
      } else {
        nextRowsMap[row.id] = rowBlock = {};
      }

      if (rowBlock.scope) {
        childRowScope = rowBlock.scope;
      } else {
        childRowScope = $scope.$new();
      }

      if (!rowBlock.scope) {
        childRowScope.row = row;
        rowBlock.scope = childRowScope;
        this.rowTemplate(childRowScope, function (clone) {
          $element[0].appendChild(clone[0]);
          rowBlock.clone = clone;
        });
      } else {
        $element[0].appendChild(rowBlock.clone[0]);
      }

      // Repeat cells
      cells = row.cells;
      lastCellsMap = this.rowCellsMaps[row.id] || {};
      nextCellsMap = {};

      for (j = 0, jj = row.cells.length; j < jj; j++) {
        cell = row.cells[j];
        colName = cell.column.colName;

        if (lastCellsMap.hasOwnProperty(colName)) {
          nextCellsMap[colName] = cellBlock = lastCellsMap[colName];
          delete lastCellsMap[colName];
        } else {
          nextCellsMap[colName] = cellBlock = {};
        }

        if (cellBlock.scope) {
          childCellScope = cellBlock.scope;
        } else {
          childCellScope = childRowScope.$new();
        }

        if (!cellBlock.scope) {
          childCellScope.cell = cell;
          cellBlock.scope = childCellScope;
          cellTransclude = this.getCellTranclude(cell);
          if (cellTransclude) {
            cellTransclude(childCellScope, function (clone) {
              rowBlock.clone[0].appendChild(clone[0]);
              cellBlock.clone = clone;
            });
          }
        } else {
          rowBlock.clone[0].appendChild(cellBlock.clone[0]);
        }

        nextCellsMap[colName] = cellBlock;
      }

      for (colName in lastCellsMap) {
        lastCellsMap[colName].clone.remove();
        lastCellsMap[colName].scope.$destroy();
        delete lastCellsMap[colName];
      }

      this.rowCellsMaps[row.id] = nextCellsMap;
    }

    // Removed any unused rows and delete them from the rows cells map
    for (var key in lastRowsMap) {
      lastRowsMap[key].clone.remove();
      lastRowsMap[key].scope.$destroy();
      delete lastRowsMap[key];
    }

    this.rowsMap = nextRowsMap;
  };
};

module.exports = TableSectionController;
