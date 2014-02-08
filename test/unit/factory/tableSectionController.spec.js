'use strict';

describe('Table section controller', function () {
  var TableSectionController,
      tableSectionController;

  beforeEach(angular.mock.module('macTable'));

  beforeEach(inject(function ($injector) {
    TableSectionController = $injector.get('TableSectionController');
  }));

  beforeEach(function () {
    var mockSection = {
      rows: []
    };
    tableSectionController = new TableSectionController(mockSection);
  });

  it('return the sections rows', function () {
    expect(angular.isArray(tableSectionController.getRows())).toBe(true);
  });

  it('returns a models attribute based on a column name', function () {
    var mockRow = {
      model: {title: 'ABC'}
    };
    expect(tableSectionController.cellValue(mockRow, 'title')).toBe('ABC');
    expect(tableSectionController.defaultCellValue(mockRow, 'title')).toBe('ABC');
  });

  it('can be extended', function () {
    var ExtendedController = TableSectionController.extend({
          attr: '123'
        }),
        extendedController = new ExtendedController({});

    expect(extendedController instanceof TableSectionController).toBe(true);
    expect(extendedController.attr).toBe('123');
  });
});
