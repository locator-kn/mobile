module Controller {
    export class TripOverviewCtrl {
        results:any = [];
        moods:any = [];
        searchView:boolean;
        page:number = 0;
        noMoreItemsAvailable:boolean;

        constructor(private $rootScope, private $state, private $stateParams, private TripService, private $scope,
                    private UserService, private DataService, private  $ionicLoading, private webPath, private SearchService) {

            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});

            // if no user id is committed -> controller used for search results
            if (!$stateParams.userId) {
                this.searchView = true;
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

        loadMore() {
            this.page++;
            debugger;
            this.SearchService.getNextTripsFromQuery(this.page).then((result) => {
                // TODO: fore each element
                // push to array
                var arrayLength = result.data.length;
                for (var i = 0; i < arrayLength; i++) {
                    this.results.push(result.data[i]);
                    //Do something
                }
                if(arrayLength < 2) {
                    this.noMoreItemsAvailable = true;
                }
                //this.results.push(result.data);
                this.$ionicLoading.hide();
                this.updateUserInfo();
                this.$scope.$broadcast('scroll.infiniteScrollComplete');
            }).catch((err)=> {
                this.$ionicLoading.hide();
            });

        }

        static controllerId:string = "TripOverviewCtrl";
    }
}
