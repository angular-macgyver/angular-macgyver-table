'use strict';

var TableColumn, guid = 0;

TableColumn = function (colName) {
  this.colName = colName;
  this.width = 0;
  this.id = '$L' + guid++;
};

TableColumn.prototype.toJSON = function () {
  return {
    colName: this.colName,
    width: this.width
  };
};

module.exports = TableColumn;
