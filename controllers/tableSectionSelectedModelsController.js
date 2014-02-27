'use strict';

var TableSectionSelectedModelsController = function ($scope, $attrs, $parse) {
  var getRangeModels = $parse($attrs.macTableSectionSelectedModels),
      setRangeModels = getRangeModels.assign;

  this.setRangeModels = function (models) {
    setRangeModels($scope, models);
  };

  this.selectedRange = [];

  this.updateRange = function () {
    var i, ii,
        srcRange,
        range,
        section,
        allRows,
        visibleRows,
        row,
        isVisible,
        inRange,
        rowIndex,
        selectedCount;

    if (!$scope.table) return;
    if (!$scope.table.sections[$attrs.macTableSection]) return;

    srcRange = $scope.$eval($attrs.macTableSectionSelectedModels) || [];
    range = [];
    selectedCount = 0;
    section = $scope.table.sections[$attrs.macTableSection];

    if (!section) return;

    allRows = section.rows;
    visibleRows = section.ctrl.getRows();

    for (i = 0, ii = allRows.length; i < ii; i++) {
      row = allRows[i];

      rowIndex = visibleRows.indexOf(row);
      isVisible = rowIndex !== -1;
      inRange = srcRange.indexOf(row.model) !== -1;
      row.selected = isVisible && inRange;

      if (row.selected) {
        selectedCount++; 
        range.push(row.model);
        if (selectedCount === 1) this.topIndex = rowIndex;
      }
    }

    this.selectedRange = range;
    setRangeModels($scope, range);
  };

  $scope.$on('macTableSectionBuildRows', this.updateRange.bind(this));
};

module.exports = TableSectionSelectedModelsController;
