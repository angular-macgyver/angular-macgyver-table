'use strict';

var tableDirective = ['Table', function (Table) {
  return {
    scope: true,
    require: "macTable",
    controller: ["$scope", "$attrs", function ($scope, $attrs) {
      this.table = $scope.table =
        $scope.$eval($attrs.macTable) || new Table();

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
