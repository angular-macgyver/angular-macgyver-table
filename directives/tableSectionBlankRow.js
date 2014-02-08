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
