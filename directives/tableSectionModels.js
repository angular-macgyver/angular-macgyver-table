'use strict';

var tableSectionModelsDirective = function () {
  return {
    require: "macTableSection",
    link: function (scope, element, attrs, controller) {
      var lastStringified, models;
      scope.$watchCollection(attrs.macTableSectionModels, function watchTableSectionModels (models) {
        if (!models) return;
        controller.build(models);
      });
    }
  };
};

module.exports = tableSectionModelsDirective;
