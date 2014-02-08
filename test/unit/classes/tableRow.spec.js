'use strict';

describe('Table row', function () {
  var TableRow = require('../../../classes/tableRow'),
      mockSection,
      mockModel,
      tableRow;

  beforeEach(function () {
    mockSection = {};
    mockModel = {};
    tableRow = new TableRow(mockSection, mockModel, [], {});
  });

  describe('structure', function () {
    it('has an id', function () {
      expect(angular.isString(tableRow.id)).toBe(true);
    });

    it('has a section', function () {
      expect(angular.isObject(tableRow.section)).toBe(true);
    });

    it('has a model', function () {
      expect(tableRow.model).toEqual(mockModel);
    });

    it('has a section', function () {
      expect(tableRow.section).toEqual(mockSection);
    });

    it('has a cells map', function () {
      expect(angular.isObject(tableRow.cellsMap)).toBe(true);
    });
  });

  it('returns the correct JSON', function () {
    var json = tableRow.toJSON();
    expect(angular.isArray(json.cells)).toBe(true);
  });
});
