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
        return JSON.stringify(controller.table);
      });
    }
  };
};

module.exports = tableSectionModelsDirective;
