module Controller {
    export class TripOverviewCtrl {
        results:any = [];
        moods:any = [];
        searchView:boolean;

        constructor(private $rootScope, private $state, private ResultService, private $stateParams, private TripService,
                    private UserService, private DataService, private  $ionicLoading, private webPath) {

        constructor(private $rootScope, private $state, private $stateParams, private TripService, private $scope,
                    private UserService, private DataService, private MessengerService, private $ionicLoading,
                    private webPath, private SearchService, maxSpinningDuration) {

            // if no user id is committed -> controller used for search results
            if (!$stateParams.userId) {
                this.searchView = true;
                this.results = ResultService.getResults();
                $rootScope.$on('newSearchResults', () => {
                    this.results = ResultService.getResults();
                    this.$ionicLoading.hide();
                    this.updateUserInfo();
                });
                this.$ionicLoading.hide();
            } else {
                this.searchView = false;
                // if user id is comitted as state param user id -> get all trips of user
                this.TripService.getTripsByUser($stateParams.userId)
                    .then(result => {
                        this.results = result.data;
                        this.updateUserInfo();
                    });
                this.$ionicLoading.hide();


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
                this.$ionicLoading.hide();
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

        static controllerId:string = "TripOverviewCtrl";
    }
}
