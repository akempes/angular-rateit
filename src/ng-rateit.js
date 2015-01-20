var module = angular.module('ngRateIt', ['ng']);

module
.directive('ngRateIt', function( $q ) {
	'use strict';

	/*jslint unparam:true */
	var link = function ($scope, $element, $attrs) {

		if(!$attrs.readonly){
			$scope.readonly = function(){return false;};
		}

		if(!$attrs.resetable){
			$scope.resetable = function(){return true;};
		}

		if(!$attrs.beforerated){
			$scope.beforerated = function(){var d = $q.defer(); d.resolve(); return d.promise;};
		}

		if(!$attrs.rated){
			$scope.rated = function(){return;};
		}

		if(!$attrs.beforereset){
			$scope.beforereset = function(){var d = $q.defer(); d.resolve(); return d.promise;};
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
			readonly   : '&?readonly',
			ispreset   : '=?ispreset',
			resetable  : '&?resetable',
			starwidth  : '=?starwidth',
			starheight : '=?starheight',
			rated      : '=?rated',
			reset      : '=?reset',
			over       : '=?over',
			beforerated: '=?beforerated',
			beforereset: '=?beforereset'
		},
		templateUrl: 'ngRateIt/ng-rate-it.html',
        require: 'ngModel',
        replace: true,
        link: link,
        controller: 'ngRateItController'
	};

})
.controller('ngRateItController', function ( $scope ) {
	'use strict';

	$scope.isHovering = false;
	$scope.offsetLeft = 0;
	$scope.orgValue = angular.copy($scope.ngModel);
	$scope.hoverValue = 0;

	$scope.min = $scope.min || 0;
	$scope.max = $scope.max || 5;
	$scope.step = $scope.step || 0.5;

	$scope.ispreset = $scope.orgValue === $scope.ngModel;
	
	$scope.starwidth = $scope.starwidth || 16;
	$scope.starheight = $scope.starheight || 16;

	$scope.resetCssOffset = 4;

	var garbage = $scope.$watch('ngModel', function () {
		$scope.ispreset = $scope.orgValue === $scope.ngModel;
	});

	$scope.removeRating = function () {
		if($scope.resetable() && !$scope.readonly()){
			$scope.beforereset().then(function() {
				$scope.ngModel = $scope.min;
				$scope.reset();
			});
		}
	};

	$scope.setValue = function () {
		if($scope.isHovering && !$scope.readonly()){
			var tmpValue = angular.copy($scope.min+$scope.hoverValue);
			$scope.beforerated(tmpValue).then(function() {
				$scope.ngModel = tmpValue;
				$scope.isHovering = false;
				$scope.rated();
			});
		}
	};

	$scope.onEnter = function (event) {
		$scope.isHovering = true;
		$scope.offsetLeft = event.originalTarget.getBoundingClientRect().x;
	};
	$scope.onHover = function (event) {
		$scope.isHovering = true;
		$scope.hoverValue = Math.round((event.clientX-$scope.offsetLeft)/$scope.starwidth/$scope.step) * $scope.step;
		$scope.over(event, $scope.hoverValue);
	};
	$scope.onLeave = function () {
		$scope.isHovering = false;
		$scope.hoverValue = 0;
	};

	$scope.$on('$destroy', function () {
		garbage();
	});

})
.run(['$templateCache',	function ($templateCache) {
	'use strict';

	$templateCache.put('ngRateIt/ng-rate-it.html',

		'<div class="ngrateit" ng-class="{\'ngrateit-readonly\': readonly()}">' +
			'<a class="ngrateit-reset" ng-mouseenter="resetCssOffset=5;" ng-mouseleave="resetCssOffset=4;" ng-if="!readonly() && resetable()" ng-click="removeRating()" ng-style="{\'width\': starwidth+\'px\', \'height\': starheight+\'px\', \'background-position\': \'0 \'+(-resetCssOffset*starheight)+\'px\'}"></a>' +
			'<div class="ngrateit-star_wrapper" ng-click="setValue()" ng-mouseenter="onEnter($event)" ng-mousemove="onHover($event)" ng-mouseleave="onLeave();" ng-style="{\'width\': ((max-min)*starwidth)+\'px\', \'height\': starheight+\'px\'}">' +
				'<div class="ngrateit-background"></div>' +
				'<div class="ngrateit-value" ng-hide="!readonly() && hoverValue>0 && hoverValue!==(ngModel-min)" ng-style="{\'width\': (ngModel-min)*starwidth+\'px\', \'background-position\': \'0 \'+(-2*starheight)+\'px\'}"></div>' +
				'<div class="ngrateit-hover" ng-if="!readonly() && hoverValue!==(ngModel-min)" ng-style="{\'width\': hoverValue*starwidth+\'px\', \'background-position\': \'0 \'+(-3*starheight)+\'px\'}" ></div>' +
			'</div>' +
		'</div>'

	);

}]);

