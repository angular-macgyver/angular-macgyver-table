'use strict';

describe('Table column', function () {
  var TableColumn = require('../../../classes/tableColumn'),
      tableColumn;

  beforeEach(function () {
    tableColumn = new TableColumn('name');
  });

  describe('structure', function () {
    it('sets the id', function () {
      expect(angular.isString(tableColumn.id)).toBe(true);
    });

    it('sets the name', function () {
      expect(tableColumn.colName).toBe('name');
    });

    it('sets the width', function () {
      expect(tableColumn.width).toBe(0);
    });
  });

  it('create the correct JSON', function () {
    var json = tableColumn.toJSON();
    expect(json.colName).toBe('name');
    expect(json.width).toBe(0);
  });
  
});
