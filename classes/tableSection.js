'use strict';

var TableSection,
    guid = 0;

TableSection = function (Controller, table, name, rows) {
  this.setController(Controller);
  this.table = table;
  this.name = name;
  this.rows = rows || [];
  this.id = '$S' + guid++;
};

TableSection.prototype.setController = function (Controller) {
  this.ctrl = new Controller(this);
};

TableSection.prototype.toJSON = function () {
  return {rows: this.rows};
};

module.exports = TableSection;
