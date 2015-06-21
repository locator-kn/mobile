module Controller {
    export class TripCtrl {

        trip:any = {};
        tripId:string;

        user:any = {};

        moods:any = [];

        // mobile screen with
        witdh;

        constructor(private $scope, private $element, private $stateParams, private SearchService, private DataService, private $ionicSlideBoxDelegate, private UserService, private $ionicLoading) {
            var elementWidth = angular.element(this.$element).width();
            this.witdh = elementWidth;
            angular.element(".tmpImageWidth").css({'width': elementWidth + "px"});

            // get trip by id from state param
            SearchService.getTripById(this.$stateParams.tripId).then((result) => {
                this.trip = result.data[0];
                // important for ion-slide!
                this.$ionicSlideBoxDelegate.update();
                // workaround, because title do not update in tripDetail.html
                $scope.navTitle = this.trip.title;

                this.UserService.getUser(this.trip.userid)
                    .then(result => {
                        this.user = result.data;
                        this.$ionicLoading.hide();
                    });
            });


            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
                this.$ionicLoading.hide();
            });
        }

        static controllerId:string = "TripCtrl";
    }
}
