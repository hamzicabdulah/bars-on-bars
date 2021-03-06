/*global angular*/
'use strict';

(function () {
    angular.module('nightlifeApp', ['ngResource'])
    .controller('nightlifeCtrl', ['$scope', '$resource', '$timeout', function ($scope, $resource, $timeout) {
        
        $scope.loading = 'loadingHidden';
        
        $scope.search = function () {
            /*Send a request to the back end to retrieve all places in a single location;
            location is generated by the value of the input element ($scope.locationVal)*/
            if ($scope.locationVal.length > 0) {
                $scope.loading = '';
                $scope.placesArr = [];
                var getPlaces = $resource('/api/' + $scope.locationVal);
                getPlaces.query(function (results) {
                    $scope.placesArr = results;
                    $scope.loading = 'loadingHidden';
                });
            }
        };
        
        /*On page load, send a request to the api to check whether a user is authenticated,
        and get their default location and call the search function on it*/
        var getLocation = $resource('/api/userDefault');
        getLocation.get(function (results) {
            $scope.locationVal = results.location;
            if ($scope.locationVal.length > 0) $scope.search();
        });
        
        $scope.clickGoing = function (placeName) {
            //Send a post request to the server in order to add the user to the going list of a specific place
            var goToPlace = $resource('api/go/:place', {place: '@place'}, {
                post: { 
                   method: "POST", 
                   params: {place: placeName}
                }
            });
            goToPlace.post(function (results) {
                //If the user is not authenticated, the server returns an object that contains a redirect property with the value of the Twitter authentication url
                if (results.redirect) {
                    window.location = results.redirect;
                } else {
                    $scope.placesArr.forEach(function (item) {
                        if (item.name === results.name) {
                            item.going = results.going.length;
                        }
                    });
                }
            });
        };
        
    }]);
})();