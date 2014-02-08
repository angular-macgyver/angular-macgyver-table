'use strict';

var SHIFT_KEY = 16,
    COMMAND_KEY = 91,
    tableSelectableDirective;

tableSelectableDirective = ['$document', function ($document) {
  var shiftselect = false,
      commandselect = false;

  $document.bind('keydown', function (event) {
    if (event.which === SHIFT_KEY) shiftselect = true;
    if (event.which === COMMAND_KEY) commandselect = true;
  });

  $document.bind('keyup', function (event) {
    if (event.which === SHIFT_KEY) shiftselect = false;
    if (event.which === COMMAND_KEY) commandselect = false;
  });

  return {
    controller: ['$scope', function ($scope) {
      this.selectRow = function (row) { 
        var i, ii,
            rows, 
            rangeController,
            selectedRange, 
            modelIndex,
            rowIndex,
            topIndex,
            rowsSlice,
            start,
            end;

        if (!$scope.section) return;

        rangeController = this.selectedModelsController;
        selectedRange = rangeController.selectedRange;

        $scope.$apply(function () {

          /*
           * Command select
           */
          if (commandselect) {
            modelIndex = selectedRange.indexOf(row.model);

            if (modelIndex !== -1) selectedRange.splice(modelIndex, 1);
            else selectedRange.push(row.model);

          /*
           * Shift select
           */
          } else if (shiftselect) {
            rows     = $scope.section.ctrl.getRows();
            rowIndex = rows.indexOf(row);
            topIndex = rangeController.topIndex;

            if (rowIndex === topIndex) {
              return;
            } else if (topIndex < rowIndex) {
              start = topIndex;
              end = rowIndex;
            } else if (topIndex > rowIndex) {
              start = rowIndex;
              end = topIndex;
            }

            rowsSlice = rows.slice(start, end + 1);
            selectedRange = rowsSlice.map(function (row) {
              return row.model;
            });

          /*
           * Normal select
           */
          } else {
            rows     = $scope.section.ctrl.getRows();
            rowIndex = rows.indexOf(row);

            if (selectedRange.length === 1 &&
                selectedRange.indexOf(row.model) !== -1) {
              selectedRange = [];
            } else {
              selectedRange = [row.model];
            }
          }

          rangeController.setRangeModels(selectedRange);
        });
      };
    }],
    require: ['^macTableSectionSelectedModels', 'macTableSelectable'],
    link: function (scope, element, attrs, controllers) {
      controllers[1].selectedModelsController = controllers[0];

      element.on('click', function (event) {
        $document[0].getSelection().removeAllRanges();
        if (!scope.$eval(attrs.macTableSelectable)) return;
        else controllers[1].selectRow(scope.row);
      });

    }
  };
}];

module.exports = tableSelectableDirective;
