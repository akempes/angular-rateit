var module = angular.module('ngRateIt', ['ng']);

module
.directive('ngRateIt', ["$q", function( $q ) {
	'use strict';

	/*jslint unparam:true */
	var link = function ($scope, $element, $attrs) {

		if(!$attrs.readOnly){
			$scope.readOnly = function(){return false;};
		}

		if(!$attrs.resetable){
			$scope.resetable = function(){return true;};
		}

		if(!$attrs.beforeRated){
			$scope.beforeRated = function(){var d = $q.defer(); d.resolve(); return d.promise;};
		}

		if(!$attrs.rated){
			$scope.rated = function(){return;};
		}

		if(!$attrs.beforeReset){
			$scope.beforeReset = function(){var d = $q.defer(); d.resolve(); return d.promise;};
		}

		if(!$attrs.reset){
			$scope.reset = function(){return;};
		}

	};
	/*jslint unparam:false */

	return {
		scope:{
			ngModel      : '=',
			min          : '=?min',
			max          : '=?max',
			step         : '=?step',
			readOnly     : '&?readOnly',
			pristine     : '=?pristine',
			resetable    : '&?resetable',
			starWidth    : '=?starWidth',
			starHeight   : '=?starHeight',
			canelWidth   : '=?canelWidth',
			cancelHeight : '=?cancelHeight',
			rated        : '=?rated',
			reset        : '=?reset',
			beforeRated  : '=?beforeRated',
			beforeReset  : '=?beforeReset'
		},
		templateUrl: 'ngRateIt/ng-rate-it.html',
        require: 'ngModel',
        replace: true,
        link: link,
        controller: 'ngRateItController'
	};

}])
.controller('ngRateItController', ["$scope", "$timeout", function ( $scope, $timeout ) {
	'use strict';

	$scope.hide = false;
	$scope.orgValue = angular.copy($scope.ngModel);

	$scope.min = $scope.min || 0;
	$scope.max = $scope.max || 5;
	$scope.step = $scope.step || 0.5;

	$scope.pristine = $scope.orgValue === $scope.ngModel;
	
	$scope.starWidth = $scope.starWidth || 16;
	$scope.starPartWidth = $scope.starWidth * $scope.step;
	$scope.starHeight = $scope.starHeight || 16;
	$scope.canelWidth = $scope.canelWidth || $scope.starWidth;
	$scope.cancelHeight = $scope.cancelHeight || $scope.starHeight;

	var diff = $scope.max - $scope.min,
	steps = diff / $scope.step,
	garbage = $scope.$watch('ngModel', function () {
		$scope.pristine = $scope.orgValue === $scope.ngModel;
	}),

	getValue = function (index) {
		return (index+1) / steps * diff;
	};

	$scope.getStartParts = function () {
		return new Array(steps);
	};

	$scope.getStarOffset = function (index) {
		var ratio = 1/$scope.step,
		offset = -($scope.starWidth/ratio)*(index%ratio);
		return  offset;
	};

	$scope.isSelected = function (index) {
		return getValue(index) <= $scope.ngModel-$scope.min;
	};

	$scope.removeRating = function () {
		if ($scope.resetable() && !$scope.readOnly()) {
			$scope.beforeReset().then(function () {
				$scope.ngModel = $scope.min;
				$scope.reset();
			});
		}
	};

	$scope.setValue = function (index) {
		if (!$scope.readOnly()) {
			$scope.hide = true; // Hide element due to presisting IOS :hover
			var tmpValue = angular.copy($scope.min + getValue(index));
			$scope.beforeRated(tmpValue).then(function () {
				$scope.ngModel = tmpValue;
				$timeout(function () {
					$scope.rated();
				});
			});
			$timeout(function () {
				$scope.hide = false;
			}, 5); // Show rating s.a.p. 
		}
	};

	$scope.$on('$destroy', function () {
		garbage();
	});

}])
.run(['$templateCache',	function ($templateCache) {
	'use strict';

	$templateCache.put('ngRateIt/ng-rate-it.html',

		'<div class="ngrateit" ng-class="{\'ngrateit-readonly\': readOnly()}">' +

    		'<a ' +
        		'ng-if="!readOnly() && resetable()"' +
        		'ng-click="removeRating()"' +
        		'class="ngrateit-reset ngrateit-star"' +
        		'ng-style="{\'width\': canelWidth+\'px\', \'height\':cancelHeight+\'px\'}"' +
    		'></a>' +

    		'<div ng-if="!hide" id="origin" class="ngrateit-rating">' +
        		'<span ' +
            		'class="ngrateit-star ngrateit-bg-star"' +
            		'ng-repeat="i in getStartParts() track by $index" ' +
            		'ng-class="{\'ngrateit-selected\': isSelected($index) }"' +
            		'ng-click="setValue($index)"' +
            		'ng-style="{\'width\': starPartWidth+\'px\', \'height\':starHeight+\'px\', \'background-position\': getStarOffset($index)+\'px 0\'}"' +
        		'><span>' +

		'</div>'

	);

}]);

