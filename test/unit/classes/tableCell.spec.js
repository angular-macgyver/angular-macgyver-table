'use strict';

describe('Table cell', function () {
  var TableCell = require('../../../classes/tableCell'),
      cellValueSpy,
      mockRow,
      mockColumn,
      tableCell;

  beforeEach(function () {
    cellValueSpy = jasmine.createSpy('cellValue');
    mockRow = {section: {ctrl: {cellValue: cellValueSpy}}};
    mockColumn = {colName: 'title'};
    tableCell = new TableCell(mockRow, mockColumn);
  });

  describe('structure', function () {
    it('has an id', function () {
      expect(angular.isString(tableCell.id)).toBe(true);
    });

    it('has the row', function () {
      expect(tableCell.row).toEqual(mockRow);
    });

    it('has the column', function () {
      expect(tableCell.column).toEqual(mockColumn);
    });
  });

  it('calls cellValue on the rows section controller', function () {
    tableCell.value();
    expect(cellValueSpy)
      .toHaveBeenCalledWith(tableCell.row, tableCell.column.colName);
  });

  it('returns the correct JSON', function () {
    var json;
    tableCell.value = jasmine.createSpy('value');
    json = tableCell.toJSON();
    expect(angular.isObject(json)).toBe(true);
    expect(json.column).toBe('title');
    expect(tableCell.value).toHaveBeenCalled();
  });
});
