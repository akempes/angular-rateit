/*global alert, confirm*/

var myApp = angular.module('exampleApp',['ngRateIt']);

myApp.controller('ExampleController', ['$scope', '$q', '$timeout', function($scope, $q, $timeout){
    'use strict';

        $scope.model = {
            basic: 0,
            readonly: 2.5,
            readonly_enables: true,
            minMaxStep:6,
            minMaxStep2:8.75,
            pristine: 3,
            resetable: 1,
            heightWidth: 1.5,
            callbacks: 5,
            custom: 4,
        };

        $scope.ratedCallback = function () {
            alert('The rated value is: '+$scope.model.callbacks);
            console.log('The rated value is: '+$scope.model.callbacks);
        };

        $scope.resetCallback = function () {
            alert('Reset clicked!');
            console.log('Reset clicked!');
        };

        $scope.confirmReset = function () {
            var d = $q.defer(); 
            if(confirm('Are you sure about resetting this rating?')){
                d.resolve();
            }else{
                d.reject();
            }
            return d.promise;
        };

        $scope.confirmRating = function (newRating) {
            var d = $q.defer(); 

            $timeout(function  () {
                if(confirm('Are you sure about rating us with '+newRating+' stars?')){
                    d.resolve();
                }else{
                    d.reject();
                }
            });
            
            return d.promise;
        };

        $scope.confirmReset = function () {
            var d = $q.defer(); 
            if(confirm('Are you sure about resetting this rating?')){
                d.resolve();
            }else{
                d.reject();
            }
            return d.promise;
        };

    }
]);


