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
