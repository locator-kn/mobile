module Controller {
    export class TripOverviewCtrl {
        results:any = [];
        moods:any = [];
        searchView:boolean = true;
        userId:string;
        page:number = 0;
        noMoreItemsAvailable:boolean;
        elementWidth:number;

        itemsProPage:number = 5;

        constructor(private $rootScope, private $state, private $stateParams, private TripService, private $scope,
                    private UserService, private DataService, private MessengerService, private $ionicLoading,
                    private webPath, private SearchService, maxSpinningDuration, private $window) {

            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: maxSpinningDuration});
            this.elementWidth = this.$window.innerWidth  - (177);


            if ($stateParams.userId) {
                // if user id is comitted as state param user id -> get all trips of user
                this.searchView = false;
                this.userId = $stateParams.userId;
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
            this.page++;
            if (this.searchView) {
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
            } else {
                // TODO: if pagination in backend implemented, change the outcomment lines
                //this.TripService.getNextTripsFromUser(this.userId, this.page, this.itemsProPage).then(result => {
                this.TripService.getTripsByUser(this.userId).then(result => {
                    // push to array
                    var arrayLength = result.data.length;
                    for (var i = 0; i < arrayLength; i++) {
                        this.results.push(result.data[i]);
                    }
                    // TODO: change this too
                    //if (arrayLength < this.itemsProPage) {
                    this.noMoreItemsAvailable = true;
                    //}
                    this.updateUserInfo();
                }).catch((err) => {
                    this.$ionicLoading.hide();
                });
            }
        }

        editTrip(tripId, userId) {
            this.$state.go('tab.profile-trip-edit', {
                tripId: tripId,
                userId: userId
            });
        }

        static controllerId:string = "TripOverviewCtrl";
    }
}
