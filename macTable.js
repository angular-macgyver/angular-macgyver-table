(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var TableCell, guid = 0;

TableCell = function (row, column) {
  this.row = row;
  this.column = column;
  this.id = '$C' + guid++;
};

TableCell.prototype.value = function () {
  if (this.row && this.row.section && this.row.section.ctrl) {
    return this.row.section.ctrl.cellValue(this.row, this.column.colName);
  }
};

TableCell.prototype.toJSON = function () {
  return {
    value: this.value(),
    column: this.column.colName
  };
};

module.exports = TableCell;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict';

var TableRow,
    guid = 0;

TableRow = function (section, model, cells, cellsMap) {
  this.section = section;
  this.model = model;
  this.cells = cells || [];
  this.cellsMap = cellsMap || {};
  this.id = '$R' + guid++;
};

TableRow.prototype.toJSON = function () {
  return {cells: this.cells};
};

module.exports = TableRow;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

var TableSectionController = function ($scope, $element, $attrs) {
  this.rowCellTemplates = {};
  this.rowCellsMaps = {};
  this.rowTemplate = null;
  this.table = null;

  this.getCellTranclude = function (cell) {
    var template, templateName;

    if (cell &&
        cell.column &&
        cell.column.colName in this.rowCellTemplates) {
      templateName = cell.column.colName;
    } else {
      templateName = '?';
    }
    template = this.rowCellTemplates[templateName];
    if (template) return template;
  };

  this.build = function (models) {
    var i, ii,
        j, jj,
        section,
        row,
        rows,
        rowBlock,
        childRowScope,
        nextRowsMap,
        lastRowsMap,
        cell,
        cells,
        cellBlock,
        childCellScope,
        colName,
        cellElement,
        nextCellsMap,
        lastCellsMap,
        cellScope,
        cellTransclude;

    if (!this.rowTemplate) return;

    this.table.load($attrs.macTableSection, models);
    $scope.section = section = this.table.sections[$attrs.macTableSection];
    rows = section.ctrl.getRows();

    lastRowsMap = this.rowsMap || {};
    nextRowsMap = {};

    for (i = 0, ii = rows.length; i < ii; i++) {
      row = rows[i];

      if (lastRowsMap.hasOwnProperty(row.id)) {
        nextRowsMap[row.id] = rowBlock = lastRowsMap[row.id];
        delete lastRowsMap[row.id];
      } else {
        nextRowsMap[row.id] = rowBlock = {};
      }

      if (rowBlock.scope) {
        childRowScope = rowBlock.scope;
      } else {
        childRowScope = $scope.$new();
      }

      if (!rowBlock.scope) {
        childRowScope.row = row;
        rowBlock.scope = childRowScope;
        this.rowTemplate(childRowScope, function (clone) {
          $element[0].appendChild(clone[0]);
          rowBlock.clone = clone;
        });
      } else {
        $element[0].appendChild(rowBlock.clone[0]);
      }

      // Repeat cells
      cells = row.cells;
      lastCellsMap = this.rowCellsMaps[row.id] || {};
      nextCellsMap = {};

      for (j = 0, jj = row.cells.length; j < jj; j++) {
        cell = row.cells[j];
        colName = cell.column.colName;

        if (lastCellsMap.hasOwnProperty(colName)) {
          nextCellsMap[colName] = cellBlock = lastCellsMap[colName];
          delete lastCellsMap[colName];
        } else {
          nextCellsMap[colName] = cellBlock = {};
        }

        if (cellBlock.scope) {
          childCellScope = cellBlock.scope;
        } else {
          childCellScope = childRowScope.$new();
        }

        if (!cellBlock.scope) {
          childCellScope.cell = cell;
          cellBlock.scope = childCellScope;
          cellTransclude = this.getCellTranclude(cell);
          if (cellTransclude) {
            cellTransclude(childCellScope, function (clone) {
              rowBlock.clone[0].appendChild(clone[0]);
              cellBlock.clone = clone;
            });
          }
        } else {
          rowBlock.clone[0].appendChild(cellBlock.clone[0]);
        }

        nextCellsMap[colName] = cellBlock;
      }

      for (colName in lastCellsMap) {
        lastCellsMap[colName].clone.remove();
        lastCellsMap[colName].scope.$destroy();
        delete lastCellsMap[colName];
      }

      this.rowCellsMaps[row.id] = nextCellsMap;
    }

    // Removed any unused rows and delete them from the rows cells map
    for (var key in lastRowsMap) {
      lastRowsMap[key].clone.remove();
      lastRowsMap[key].scope.$destroy();
      delete lastRowsMap[key];
    }

    this.rowsMap = nextRowsMap;
  };
};

module.exports = TableSectionController;

},{}],6:[function(require,module,exports){
'use strict';

var TableSectionSelectedModelsController = function ($scope, $attrs, $parse) {
  var getRangeModels = $parse($attrs.macTableSectionSelectedModels),
      setRangeModels = getRangeModels.assign;

  this.setRangeModels = function (models) {
    setRangeModels($scope, models);
  };

  this.selectedRange = [];

  $scope.$watch(function () {
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

    return JSON.stringify($scope.table);
  }.bind(this));
};

module.exports = TableSectionSelectedModelsController;

},{}],7:[function(require,module,exports){
'use strict';

var tableDirective = ['Table', function (Table) {
  return {
    scope: true,
    require: "macTable",
    controller: ["$scope", function ($scope) {
      this.table = $scope.table = new Table();
      this.table.$parent = $scope.$parent;
    }],
    link: function (scope, element, attrs, controller) {
      scope.$watchCollection(attrs.macTableColumns, function (columns) {
        controller.table.loadColumns(columns);
      });
    }
  };
}];

module.exports = tableDirective;

},{}],8:[function(require,module,exports){
'use strict';

var tableCellDirective = function () {
  return {
    transclude: 'element',
    priority: 1000,
    terminal: true,
    require: '^macTableSection',
    link: function (scope, element, attrs, controller, transclude) {
      var templateNames;

      if (attrs.macCellTemplate) {
        templateNames = attrs.macCellTemplate.split(' ');
      } else {
        templateNames = ['?'];
      }

      templateNames.forEach(function (templateName) {
        controller.rowCellTemplates[templateName] = transclude;
      });
    }
  };
};

module.exports = tableCellDirective;

},{}],9:[function(require,module,exports){
'use strict';

var tableRowDirective = function () {
  return {
    require: '^macTableSection',
    terminal: true,
    transclude: 'element',
    priority: 1000,
    link: function (scope, element, attrs, controller, transclude) {
      controller.rowTemplate = transclude;
    }
  };
};

module.exports = tableRowDirective;

},{}],10:[function(require,module,exports){
'use strict';

var TableSectionController = require('../controllers/tableSectionController'),
    tableSectionDirective;

var tableSectionDirective = function () {
  return {
    scope: true,
    require: ["^macTable", "macTableSection"],
    controller: ['$scope', '$element', '$attrs', TableSectionController],
    link: function (scope, element, attrs, controllers) {
      controllers[1].table = controllers[0].table;
    }
  };
};

module.exports = tableSectionDirective;

},{"../controllers/tableSectionController":5}],11:[function(require,module,exports){
'use strict';

var tableSectionBlankRowDirective = function () {
  return {
    require: ['macTableSection'],
    link: function (scope, element, attrs, controller) {
      var model = {};
      scope.$watch(function () {
        controller[0].build(model);
      });
    }
  };
};

module.exports = tableSectionBlankRowDirective;

},{}],12:[function(require,module,exports){
'use strict';

var tableSectionControllerDirective = function () {
  return {
    require: "macTableSection",
    link: function (scope, element, attrs, controller) {
      var Controller, lastController;
      scope.$watch(function () {
        Controller = scope.$eval(attrs.macTableSectionController);
        if (Controller && Controller !== lastController) {
          controller.table.load(attrs.macTableSection, null, Controller);
          lastController = Controller;
        }
        return lastController;
      });
    }
  };
};

module.exports = tableSectionControllerDirective;

},{}],13:[function(require,module,exports){
'use strict';

var tableSectionModelsDirective = function () {
  return {
    require: "macTableSection",
    link: function (scope, element, attrs, controller) {
      var lastStringified, models;
      scope.$watch(function () {
        models = scope.$eval(attrs.macTableSectionModels);
        if (!models) return;
        controller.build(models);
        return JSON.stringify(controller.table.sections[attrs.macTableSection]);
      });
    }
  };
};

module.exports = tableSectionModelsDirective;

},{}],14:[function(require,module,exports){
'use strict';

var TableSectionSelectedModelsController = require('../controllers/tableSectionSelectedModelsController'),
    tableSectionSelectedModelsDirective;

tableSectionSelectedModelsDirective = function () {
  return {
    controller: [
      '$scope', 
      '$attrs', 
      '$parse', 
      TableSectionSelectedModelsController
    ],
    require: ['macTableSection', 'macTableSectionSelectedModels']
  };
};

module.exports = tableSectionSelectedModelsDirective;

},{"../controllers/tableSectionSelectedModelsController":6}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
'use strict';

var TableFactory = ["TableSectionController", function (TableSectionController) {
  var Table,
      TableRow = require('../classes/tableRow'),
      TableColumn = require('../classes/tableColumn'),
      TableSection = require('../classes/tableSection'),
      TableCell = require('../classes/tableCell'),
      rowFactory,
      columnFactory,
      sectionFactory,
      cellFactory,
      convertObjectModelsToArray;

  /*
  * Class Factories
  */
  rowFactory = function (section, model) {
    return new TableRow(section, model);
  };

  columnFactory = function (colName) {
    return new TableColumn(colName);
  };

  sectionFactory = function (table, sectionName, Controller) {
    return new TableSection(Controller || TableSectionController, table, sectionName);
  };

  cellFactory = function (row, column) {
    return new TableCell(row, column);
  };

  /*
  * Utility Functions
  */
  convertObjectModelsToArray = function (models) {
    if (models && !angular.isArray(models)) return [models];
    else return models;
  };

  /*
  * Table Class Constructor
  */
  Table = function (columns) {
    this.sections = {};
    this.columnsOrder = [];
    this.columnsMap = {};

    this.loadColumns(columns || []);
  };

  /*
   * Load
   *
   * Takes a section name and optionally a models array and or section
   * controller.
   */
  Table.prototype.load = function (sectionName, models, Controller) {
    // If we've been passed a section name that doesn't exist, create it
    if (!this.sections[sectionName]) {
      this.sections[sectionName] = sectionFactory(this, sectionName);
    }
    // If we've been passed a controller, set it as the controller for that
    // section
    if (Controller) {
      this.sections[sectionName].setController(Controller);
    }
    // If we've got models, load them into the section
    if (models) this.loadModels(sectionName, models);

    return this;
  };

  /*
   * Load Models
   *
   * Takes a section name and models array.
   */
  Table.prototype.loadModels = function (sectionName, srcModels) {
    var orderedRows = [],
        sectionModels = [],
        removedRows = [],
        section = this.sections[sectionName],
        models = convertObjectModelsToArray(srcModels),
        i, ii,
        rowIndex,
        row,
        modelIndex,
        model;

    // Loop through the sections current rows
    // if any models matched mark them as removed [1]
    // otherwise, mark them as something to add [2]
    for (i = 0, ii = section.rows.length; i < ii; i++) {
      row = section.rows[i];
      rowIndex = models.indexOf(row.model);
      if (rowIndex === -1) {
        removedRows.push(row); /* [1] */
      } else {
        orderedRows[rowIndex] = row; /* [2] */
        sectionModels[rowIndex] = row.model;
      }
    }

    // Loop over the models passed in
    // if the model hasn't already been added in move on [3]
    // otherwise, create a new row for that model [4]
    for (i = 0, ii = models.length; i < ii; i++) {
      model = models[i];
      if (sectionModels.indexOf(model) === -1) { /* [3] */
        orderedRows[i] = this.newRow(section, model); /* [4] */
      }
    }

    // Replace the rows with our new rows in the correct order [5]
    // then store the removed rows on the section to check against [6]
    section.rows = orderedRows; /* [5] */
    section.removedRows = removedRows; /* [6] */
  };

  /*
   * Load Columns
   *
   * Syncronizes column order and names w/ row cells and order.
   * Optionally can take a new array of columns to update the table.
   */
  Table.prototype.loadColumns = function (srcColumnsOrder) {
    var lastColumnsMap = this.columnsMap,
        i, ii,
        j, jj,
        colName,
        column,
        sectionName,
        section,
        row,
        cells,
        cell;

    // Passing in new columns is optional
    if (srcColumnsOrder) this.columnsOrder = srcColumnsOrder;

    this.columnsMap = {};
    this.columns = [];

    // Create our new columns map and array of columns
    for (i = 0, ii = this.columnsOrder.length; i < ii; i++) {
      colName = this.columnsOrder[i];
      column = lastColumnsMap[colName];

      if (!column) column = columnFactory(colName);

      this.columnsMap[colName] = this.columns[i] = column;
    }

    // Loop through each section, and then each sections rows, and then each
    // rows cells, reorder them based on the columnsOrder, if a cel doesn't
    // exist, add it, if there are extra cells, they will be dropped
    for (sectionName in this.sections) {
      section = this.sections[sectionName];
      for (i = 0, ii = section.rows.length; i < ii; i++) {
        row = section.rows[i];
        cells = [];
        for (j = 0, jj = this.columnsOrder.length; j < jj; j++) {
          colName = this.columnsOrder[j];
          cell = row.cellsMap[colName];
          if (!cell) {
            column = this.columnsMap[colName];
            cell = cellFactory(row, column);
          }
          cells[j] = cell;
        }
        row.cells = cells;
      }
    }
    return this;
  };

  Table.prototype.blankRow = function () {
    return this.columnsOrder.reduce(function (row, colName) {
      row[colName] = null;
      return row;
    }, {});
  };

  Table.prototype.newRow = function (section, model) {
    var row = rowFactory(section, model),
        i, ii,
        colName,
        column,
        cell;

    for (i = 0, ii = this.columnsOrder.length; i < ii; i++) {
      colName = this.columnsOrder[i]; 
      column = this.columnsMap[colName];
      cell = cellFactory(row, column);
      row.cellsMap[colName] = cell;
      row.cells[i] = cell;
    }

    return row;
  };

  Table.prototype.setColumnWidth = function (colName, width) {
    var passedColumn = false,
        prevSiblingLength = 0,
        i, ii,
        lastWidth, 
        column,
        scale;

    for (i = 0, ii = this.columns.length; i < ii; i++) {
      column = this.columns[i];
      if (column.colName === colName) {
        prevSiblingLength += width;
        if (prevSiblingLength >= 100) return;
        passedColumn = true;
        scale = (100 - prevSiblingLength) / (ii - (i + 1));
        column.width = width;
      } else if (passedColumn) {
        column.width = scale;   
      } else {
        prevSiblingLength += column.width || 0;
      }
    }
  };

  Table.prototype.toJSON = function () {
    return {sections: this.sections};
  };

  return Table;
}];

module.exports = TableFactory;

},{"../classes/tableCell":1,"../classes/tableColumn":2,"../classes/tableRow":3,"../classes/tableSection":4}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
'use strict';

angular.module('macTable', [])
  .factory('TableSectionController',
      require('./factory/tableSectionController'))
  .factory('Table',
      require('./factory/table'))
  .directive('macTable',
      require('./directives/table'))
  .directive('macTableSection',
      require('./directives/tableSection'))
  .directive('macTableSectionBlankRow',
      require('./directives/tableSectionBlankRow'))
  .directive('macTableSectionModels',
      require('./directives/tableSectionModels'))
  .directive('macTableSectionController',
      require('./directives/tableSectionController'))
  .directive('macTableRow',
      require('./directives/tableRow'))
  .directive('macCellTemplate',
      require('./directives/tableCell'))
  .directive('macTableSectionSelectedModels',
      require('./directives/tableSectionSelectedModels'))
  .directive('macTableSelectable',
      require('./directives/tableSelectable'))
  ;

},{"./directives/table":7,"./directives/tableCell":8,"./directives/tableRow":9,"./directives/tableSection":10,"./directives/tableSectionBlankRow":11,"./directives/tableSectionController":12,"./directives/tableSectionModels":13,"./directives/tableSectionSelectedModels":14,"./directives/tableSelectable":15,"./factory/table":16,"./factory/tableSectionController":17}]},{},[18])