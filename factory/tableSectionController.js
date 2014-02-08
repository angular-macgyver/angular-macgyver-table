'use strict';

var TableSectionControllerFactory = function () {
  var TableSectionController = function(section) {
    this.section = section;
  };
  TableSectionController.prototype.cellValue = function(row, colName) {
    return this.defaultCellValue(row, colName);
  };
  TableSectionController.prototype.defaultCellValue = function(row, colName) {
    if (row.model) return row.model[colName];
  };
  TableSectionController.prototype.getRows = function() {
    return this.section.rows;
  };
  TableSectionController.extend = function (protoProps, staticProps) {
    var parent = this;
    var child;

    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    angular.extend(child, parent, staticProps); 

    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if (protoProps) angular.extend(child.prototype, protoProps);

    child.__super__ = parent.prototype;
    return child;
  };
  return TableSectionController;
};

module.exports = TableSectionControllerFactory;
