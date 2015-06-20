module Controller {
    export class TripOverviewCtrl {
        results:any;

        moods:any = [];

        // TODO: to test
        witdh;

        constructor(private $rootScope, private ResultService, private $stateParams, private TripService, private $element, private DataService, private  $ionicLoading) {
            // css test TOOD: remove
            var elementWidth = angular.element(this.$element).width();
            this.witdh = elementWidth;
            angular.element(".tmpImageWidth").css({'width': elementWidth + "px"});

            // if no user id is committed -> controller used for search results
            if(!$stateParams.userId){
                this.results = ResultService.getResults();
                $rootScope.$on('newSearchResults', () => {
                    this.results = ResultService.getResults();
                    this.$ionicLoading.hide();
                });
            } else {
                // if user id is comitted as state param user id -> get all trips of user
                this.TripService.getTripsByUser($stateParams.userId)
                    .then(result => {
                    this.results = result.data;
                });
            }

            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
            });

        }

        static
            controllerId:string = "TripOverviewCtrl";
    }
}
