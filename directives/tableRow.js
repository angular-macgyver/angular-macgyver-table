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
