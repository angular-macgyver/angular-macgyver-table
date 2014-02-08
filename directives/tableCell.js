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
