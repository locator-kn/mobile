/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-translate/angular-translate.d.ts" />
/// <reference path="../../typings/cordova-ionic/cordova-ionic.d.ts" />
/// <reference path="../../typings/cordova/cordova.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />

/// <reference path="controller/welcomeCtrl.ts" />
/// <reference path="controller/searchCtrl.ts" />


// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic'])

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

    .controller(Controller.WelcomeCtrl.controllerId, Controller.WelcomeCtrl)
    .controller(Controller.SearchCtrl.controllerId, Controller.SearchCtrl)

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
                        templateUrl: 'templates/tab-search.html'
                    }
                }
            })

            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html'
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
