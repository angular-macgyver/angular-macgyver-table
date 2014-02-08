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
