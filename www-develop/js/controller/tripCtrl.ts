module Controller {
    export class TripCtrl {

        trip:any = {};
        tripId:string;

        user:any = {};

        moods:any = [];

        // TODO remove variable
        witdh;

        constructor(private $scope, private $element, private $stateParams, private SearchService, private DataService, private UserService) {
            // TODO remove line
            this.witdh = angular.element(this.$element).width();

            // get trip by id from state param
            SearchService.getTripById(this.$stateParams.tripId).then((result) => {
                this.trip = result.data[0];
                // TODO: workaround, because title do not update in tripDetail.html
                $scope.navTitle = this.trip.title;

                this.UserService.getUser(this.trip.userid)
                    .then(result => {
                        this.user = result.data;
                    });
            });


            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
            });


        }

        static
            controllerId:string = "TripCtrl";
    }
}
