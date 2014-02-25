'use strict';

var TableSectionController = require('../controllers/tableSectionController'),
    tableSectionDirective;

var tableSectionDirective = function () {
  return {
    scope: true,
    require: ["^macTable", "macTableSection"],
    controller: ['$scope', '$element', '$attrs', '$animate', TableSectionController],
    link: function (scope, element, attrs, controllers) {
      controllers[1].table = controllers[0].table;
    }
  };
};

module.exports = tableSectionDirective;
