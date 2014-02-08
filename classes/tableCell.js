'use strict';

var TableCell, guid = 0;

TableCell = function (row, column) {
  this.row = row;
  this.column = column;
  this.id = '$C' + guid++;
};

TableCell.prototype.value = function () {
  if (this.row && this.row.section && this.row.section.ctrl) {
    return this.row.section.ctrl.cellValue(this.row, this.column.colName);
  }
};

TableCell.prototype.toJSON = function () {
  return {
    value: this.value(),
    column: this.column.colName
  };
};

module.exports = TableCell;
