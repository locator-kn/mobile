module Controller {
    export class TripOverviewCtrl {
        results:any;
        moods:any = [];
        searchView:boolean;

        constructor(private $rootScope, private $state, private ResultService, private $stateParams, private TripService,
                    private UserService, private DataService, private  $ionicLoading, private webPath) {

            // if no user id is committed -> controller used for search results
            if (!$stateParams.userId) {
                this.searchView = true;
                this.results = ResultService.getResults();
                $rootScope.$on('newSearchResults', () => {
                    this.results = ResultService.getResults();
                    this.$ionicLoading.hide();
                    this.updateUserInfo();
                });
            } else {
                this.searchView = false;
                // if user id is comitted as state param user id -> get all trips of user
                this.TripService.getTripsByUser($stateParams.userId)
                    .then(result => {
                        this.results = result.data;
                        this.updateUserInfo();
                    });
                this.$ionicLoading.hide();

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

        numberOfElelementsIn(obj) {
            return Object.keys(obj).length;
        }

        static controllerId:string = "TripOverviewCtrl";
    }
}
