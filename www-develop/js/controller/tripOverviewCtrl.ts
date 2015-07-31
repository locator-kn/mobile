module Controller {
    export class TripOverviewCtrl {
        results:any = [];
        moods:any = [];
        searchView:boolean = true;
        myTrips:boolean;
        userId:string;
        page:number = 0;
        noMoreItemsAvailable:boolean;
        elementWidth:number;

        itemsProPage:number = 5;

        constructor(private UtilityService, private $rootScope, private $state, private $stateParams, private TripService, private $scope,
                    private UserService, private DataService, private MessengerService, private $ionicLoading,
                    private webPath, private SearchService, maxSpinningDuration, private $window, private $ionicPopup) {

            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: maxSpinningDuration});
            this.elementWidth = this.$window.innerWidth - (177);


            if ($stateParams.userId) {
                // if user id is comitted as state param user id -> get all trips of user
                this.searchView = false;
                this.userId = $stateParams.userId;
                if (this.userId === this.$rootScope.userID) {
                    this.myTrips = true;
                }
            } else {
                // if no user id is committed -> controller used for search results
                this.searchView = true;
            }

            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
            });
        }

        /**
         * Function to update userinfo of each trip
         */
        updateUserInfo = ()=> {
            this.results.forEach((currentValue) => {
                this.UserService.getUser(currentValue.userid).then((result) => {
                    currentValue.username = result.data.name + ' ' + result.data.surname;
                    currentValue.user = result.data;
                })
            })
        };

        formatDate = (date) => {
            return moment(new Date(date)).format('L');
        };

        showTripDetail = (tripId, userId) => {
            if (this.searchView) {
                var state = 'tab.search-result-trip';
            } else {
                var state = 'tab.profile-trip';
            }

            this.$state.go(state, {
                tripId: tripId,
                userId: userId
            });
        };

        showLocations(locationSource) {
            if (this.searchView) {
                this.$state.go('tab.search-result-locations', {locationSourceId: locationSource});
            } else {
                this.$state.go('tab.profile-trip-locations', {locationSourceId: locationSource});
            }
        }


        startConversation(user, trip) {
            if (!this.$rootScope.authenticated) {
                return this.UserService.openLoginModal();
            }

            this.UserService.getMe().then(me => {
                var participant = me.data;
                var msg = this.MessengerService.getInitMessage(user, trip, participant);
                this.MessengerService.startInitConversation(msg, user.id || user._id, trip._id || trip.id).then((result:any) => {
                    var conId = result.data.id;
                    this.$state.go('tab.messenger-messages', {opponentId: user._id, conversationId: conId});
                    //this.$rootScope.$broadcast('new_conversation');
                });
            });
        }

        numberOfElelementsIn(obj) {
            return Object.keys(obj).length;
        }

        loadMore() {
            if (this.searchView) {
                this.page++;
                this.SearchService.getNextTripsFromQuery(this.page, this.itemsProPage).then((result) => {
                    // push to array
                    var arrayLength = result.data.length;
                    for (var i = 0; i < arrayLength; i++) {
                        this.results.push(result.data[i]);
                        //Do something
                    }
                    if (arrayLength < this.itemsProPage) {
                        this.noMoreItemsAvailable = true;
                    }
                    this.updateUserInfo();
                    this.$ionicLoading.hide();
                    this.$scope.$broadcast('scroll.infiniteScrollComplete');
                }).catch((err)=> {
                    this.$ionicLoading.hide();
                });
            } else if (this.myTrips) {
                this.TripService.getNextTripsFromMe(this.page, this.itemsProPage).then(result => {
                    // push to array
                    var arrayLength = result.data.length;
                    for (var i = 0; i < arrayLength; i++) {
                        this.results.push(result.data[i]);
                    }
                    if (arrayLength < this.itemsProPage) {
                        this.noMoreItemsAvailable = true;
                        console.log(this.noMoreItemsAvailable);
                    }
                    this.updateUserInfo();
                    this.$ionicLoading.hide();
                    this.$scope.$broadcast('scroll.infiniteScrollComplete');
                }).catch((err) => {
                    this.$ionicLoading.hide();
                });
                this.page++;
            } else {
                this.TripService.getNextTripsFromUser(this.userId, this.page, this.itemsProPage).then(result => {
                    //this.TripService.getTripsByUser(this.userId).then(result => {
                    // push to array
                    var arrayLength = result.data.length;
                    for (var i = 0; i < arrayLength; i++) {
                        this.results.push(result.data[i]);
                    }
                    if (arrayLength < this.itemsProPage) {
                        this.noMoreItemsAvailable = true;
                        console.log(this.noMoreItemsAvailable);
                    }
                    this.updateUserInfo();
                    this.$ionicLoading.hide();
                    this.$scope.$broadcast('scroll.infiniteScrollComplete');
                }).catch((err) => {
                    this.$ionicLoading.hide();
                });
                this.page++;
            }
        }

        editTrip(tripId, userId) {
            this.$state.go('tab.profile-trip-edit', {
                tripId: tripId,
                userId: userId
            });
        }

        togglePublic(tripId) {
            this.TripService.togglePublicTrips(tripId);
        }

        deleteTrip(tripId) {
            var confirmPopup = this.UtilityService.getConfirmPopup('Trip löschen',
                'Bist du dir sicher, dass du deinen Trip löschen möchtest?', 'Abbrechen', 'OK');
            confirmPopup.then((res) => {
                if (res) {
                    this.TripService.deleteTrip(tripId)
                        .then(result => {
                            this.UtilityService.showPopup('Trip erfolgreich gelöscht');
                            this.$state.go('tab.profile', {userId: this.$rootScope.userID});
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            });
        }

        static controllerId:string = "TripOverviewCtrl";
    }
}
