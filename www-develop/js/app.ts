/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-translate/angular-translate.d.ts" />
/// <reference path="../../typings/cordova-ionic/cordova-ionic.d.ts" />
/// <reference path="../../typings/cordova/cordova.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />

/// <reference path="controller/welcomeCtrl.ts" />
/// <reference path="controller/searchCtrl.ts" />
/// <reference path="controller/searchResultCtrl.ts" />
/// <reference path="controller/tripCtrl.ts" />
/// <reference path="controller/cityCtrl.ts" />
/// <reference path="controller/moodCtrl.ts" />
/// <reference path="controller/locateCtrl.ts" />
/// <reference path="controller/loginCtrl.ts" />

/// <reference path="./service/dataService.ts" />
/// <reference path="./service/searchService.ts" />
/// <reference path="./service/userService.ts" />
/// <reference path="./service/resultService.ts" />
/// <reference path="./service/cameraService.ts" />
/// <reference path="./service/geolocationService.ts" />

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var deps = [
    'ionic',
    'ngLodash',
    'locator.accommodation-equipment-chooser',
    'angular-cache'
];

angular.module('starter', deps)

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            /*if (window.StatusBar) {
             // org.apache.cordova.statusbar required
             StatusBar.styleLightContent();
             }*/
        });
    })

    // constants
    .constant('basePath', '<%= basePath %>')

    // controler
    .controller(Controller.WelcomeCtrl.controllerId, Controller.WelcomeCtrl)
    .controller(Controller.SearchCtrl.controllerId, Controller.SearchCtrl)
    .controller(Controller.SearchResultCtrl.controllerId, Controller.SearchResultCtrl)
    .controller(Controller.TripCtrl.controllerId, Controller.TripCtrl)
    .controller(Controller.CityCtrl.controllerId, Controller.CityCtrl)
    .controller(Controller.MoodCtrl.controllerId, Controller.MoodCtrl)
    .controller(Controller.LocateCtrl.controllerId, Controller.LocateCtrl)
    .controller(Controller.LoginCtrl.controllerId, Controller.LoginCtrl)

    // services
    .service(Service.DataService.serviceId, Service.DataService)
    .service(Service.SearchService.serviceId, Service.SearchService)
    .service(Service.ResultService.serviceId, Service.ResultService)
    .service(Service.CameraService.serviceId, Service.CameraService)
    .service(Service.GeolocationService.serviceId, Service.GeolocationService)
    .service(Service.UserService.serviceId, Service.UserService)

    .config(function (CacheFactoryProvider) {
        angular.extend(CacheFactoryProvider.defaults, {maxAge: 15 * 60 * 1000});
    })

    .filter('startsWith', function () {
        return function (array, search) {
            var matches = [];
            if (search) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].title.toLowerCase().indexOf(search.toLowerCase()) === 0 &&
                        search.length < array[i].title.length) {
                        matches.push(array[i]);
                    }
                }
            }
            return matches;
        };
    })

    .directive('resultdate', function () {
        return {
            scope: {date: '='},
            controller: function ($scope) {
                var date = new Date($scope.date);
                $scope.date = moment(date).format('L');
            },
            template: '{{date}}'
        };
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider


            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            .state('tab.welcome', {
                url: '/welcome',
                views: {
                    'tab-welcome': {
                        templateUrl: 'templates/tab-welcome.html'
                    }
                }
            })


            // Each tab has its own nav history stack:
            .state('tab.offer', {
                url: '/offer',
                views: {
                    'tab-offer': {
                        templateUrl: 'templates/tab-offer.html'
                    }
                }
            })

            .state('tab.search', {
                url: '/search',
                views: {
                    'tab-search': {
                        templateUrl: 'templates/tab-search/search.html'
                    }
                }
            })

            .state('tab.search-city', {
                url: '/city',
                views: {
                    'tab-search': {
                        templateUrl: 'templates/tab-search/city.html'
                    }
                }
            })
            .state('tab.search-moods', {
                url: '/moods',
                views: {
                    'tab-search': {
                        templateUrl: 'templates/tab-search/moods.html'
                    }
                }
            })
            .state('tab.search-result', {
                url: '/result',
                views: {
                    'tab-search': {
                        templateUrl: 'templates/tab-search/result.html'
                    }
                }
            }).state('tab.search-result-trip', {
                url: '/trip/:tripId',
                views: {
                    'tab-search': {
                        templateUrl: 'templates/tab-search/trip.html'
                    }
                }
            })

            .state('tab.chat', {
                url: '/chat',
                views: {
                    'tab-chat': {
                        templateUrl: 'templates/tab-chat.html'
                    }
                }
            }).state('tab.locate', {
                url: '/locate',
                views: {
                    'tab-locate': {
                        templateUrl: 'templates/tab-locate.html'
                    }
                }
            })

            .state('tab.profile', {
                url: '/profile',
                views: {
                    'tab-profile': {
                        templateUrl: 'templates/tab-profile.html'
                    }
                }
            });

        // for android to set tabs at bottom position
        $ionicConfigProvider.tabs.position('bottom');
        // set navbar Title to center
        $ionicConfigProvider.navBar.alignTitle('center');

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/welcome');

    });
