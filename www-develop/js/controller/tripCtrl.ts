module Controller {
    export class TripCtrl {

        trip:any = {};
        tripId:string;

        moods:any = [];

        // TODO remove
        witdh;

        constructor(private $rootScope, private $element, private $stateParams, private SearchService, private DataService) {
            // TODO remove
            this.witdh =  angular.element(this.$element).width();

            // get trip by id from state param
            SearchService.getTripById(this.$stateParams.tripId).then((result) => {
                this.trip = result.data[0];
                $rootScope.navTitle = this.trip.title;
            });

            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
            });


        }

        static
            controllerId:string = "TripCtrl";
    }
}
