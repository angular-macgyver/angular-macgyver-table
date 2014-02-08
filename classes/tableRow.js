'use strict';

var TableRow,
    guid = 0;

TableRow = function (section, model, cells, cellsMap) {
  this.section = section;
  this.model = model;
  this.cells = cells || [];
  this.cellsMap = cellsMap || {};
  this.id = '$R' + guid++;
};

TableRow.prototype.toJSON = function () {
  return {cells: this.cells};
};

module.exports = TableRow;
