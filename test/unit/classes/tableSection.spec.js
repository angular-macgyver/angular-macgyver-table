'use strict';

describe('Table section', function () {
  var TableSection = require('../../../classes/tableSection'),
      mockTable,
      Controller,
      tableSection;

  beforeEach(function () {
    mockTable = {};
    Controller = function (section) { this.section = section; };
    tableSection = new TableSection(Controller, mockTable, 'body', []);
  });

  describe('structure', function () {
    it('has an id', function () {
      expect(angular.isString(tableSection.id)).toBe(true);
    });

    it('has a table', function () {
      expect(tableSection.table).toEqual(mockTable);
    });

    it('has a name', function () {
      expect(tableSection.name).toBe('body');
    });

    it('has rows', function () {
      expect(angular.isArray(tableSection.rows)).toBe(true);
    });

    it('has a controller instance with the section', function () {
      expect(tableSection.ctrl instanceof Controller).toBe(true);
      expect(tableSection.ctrl.section).toBe(tableSection);
    });
  });

  it('returns the correct JSON', function () {
    var json = tableSection.toJSON();
    expect(angular.isArray(json.rows)).toBe(true);
  });
});
