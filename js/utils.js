var underscore = angular.module('underscore', []);
	underscore.factory('_', ['$window', function($window) {
	  return $window._; // assumes underscore has already been loaded on the page
}]);

// Filter to capitalize the first character
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
});

// Filter to convert CamelCase to Camel Case (ie Normal Case)
app.filter('stringify', function() {
    return function(input) {
      return input
      	.replace(/([A-Z])/g, ' $1')
      	.replace(/^./, function(str){ return str.toUpperCase(); 
      });
    };
});

app.directive('pageSelect', function() {
  return {
    restrict: 'E',
    template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
    link: function(scope, element, attrs) {
      scope.$watch('currentPage', function(c) {
        scope.inputPage = c;
      });
    }
  }
});