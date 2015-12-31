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

		if(!$attrs.over){
			$scope.over = function(){return;};
		}

	};
	/*jslint unparam:false */

	return {
		scope:{
			ngModel    : '=',
			min        : '=?min',
			max        : '=?max',
			step       : '=?step',
			readOnly   : '&?readOnly',
			pristine   : '=?pristine',
			resetable  : '&?resetable',
			starWidth  : '=?starWidth',
			starHeight : '=?starHeight',
			rated      : '=?rated',
			reset      : '=?reset',
			over       : '=?over',
			beforeRated: '=?beforeRated',
			beforeReset: '=?beforeReset'
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

	$scope.isHovering = false;
	$scope.offsetLeft = 0;
	$scope.orgValue = angular.copy($scope.ngModel);
	$scope.hoverValue = 0;

	$scope.min = $scope.min || 0;
	$scope.max = $scope.max || 5;
	$scope.step = $scope.step || 0.5;

	$scope.pristine = $scope.orgValue === $scope.ngModel;
	
	$scope.starWidth = $scope.starWidth || 16;
	$scope.starHeight = $scope.starHeight || 16;

	$scope.resetCssOffset = 4;

	var garbage = $scope.$watch('ngModel', function () {
		$scope.pristine = $scope.orgValue === $scope.ngModel;
	});

	$scope.removeRating = function () {
		if ($scope.resetable() && !$scope.readOnly()) {
			$scope.beforeReset().then(function () {
				$scope.ngModel = $scope.min;
				$scope.reset();
			});
		}
	};

	$scope.setValue = function () {
		if ($scope.isHovering && !$scope.readOnly()) {
			var tmpValue = angular.copy($scope.min + $scope.hoverValue);
			$scope.beforeRated(tmpValue).then(function () {
				$scope.ngModel = tmpValue;
				$scope.isHovering = false;
				$timeout(function () {
					$scope.rated();
				});
			});
		}
	};

	$scope.onEnter = function (event) {
		$scope.isHovering = true;
		$scope.offsetLeft = 0;

		var el = event.originalTarget || event.srcElement || event.target;
		$scope.offsetLeft = el.getBoundingClientRect().left;
	};
	$scope.onHover = function (event) {
		$scope.isHovering = true;
		$scope.hoverValue = Math.round((event.clientX - $scope.offsetLeft) / $scope.starWidth / $scope.step) * $scope.step;
		$scope.over(event, $scope.hoverValue);
	};
	$scope.onLeave = function () {
		$scope.isHovering = false;
		$scope.hoverValue = 0;
	};

	$scope.$on('$destroy', function () {
		garbage();
	});

}])
.run(['$templateCache',	function ($templateCache) {
	'use strict';

	$templateCache.put('ngRateIt/ng-rate-it.html',

		'<div class="ngrateit" ng-class="{\'ngrateit-readonly\': readOnly()}">' +
			'<a class="ngrateit-background ngrateit-reset" ng-mouseenter="resetCssOffset=5;" ng-mouseleave="resetCssOffset=4;" ng-if="!readOnly() && resetable()" ng-click="removeRating()" ng-style="{\'width\': starWidth+\'px\', \'height\': starHeight+\'px\', \'background-position\': \'0 \'+(-resetCssOffset*starHeight)+\'px\'}"></a>' +
			'<div class="ngrateit-star_wrapper" ng-click="setValue()" ng-mouseenter="onEnter($event)" ng-mousemove="onHover($event)" ng-mouseleave="onLeave();" ng-style="{\'width\': ((max-min)*starWidth)+\'px\', \'height\': starHeight+\'px\'}">' +
				'<div class="ngrateit-background"></div>' +
				'<div class="ngrateit-value" ng-hide="!readOnly() && hoverValue>0 && hoverValue!==(ngModel-min)" ng-style="{\'width\': (ngModel-min)*starWidth+\'px\', \'background-position\': \'0 \'+(-2*starHeight)+\'px\'}"></div>' +
				'<div class="ngrateit-hover" ng-if="!readOnly() && hoverValue!==(ngModel-min)" ng-style="{\'width\': hoverValue*starWidth+\'px\', \'background-position\': \'0 \'+(-3*starHeight)+\'px\'}" ></div>' +
			'</div>' +
		'</div>'

	);

}]);

