module Controller {
    export class TripCtrl {

        trip:any = {};
        tripId:string;

        moods:any = [];

        constructor(private $scope, private $rootScope, private $stateParams, private $state, private SearchService, private DataService) {
            // get trip by id from state param
            SearchService.getTripById(this.$stateParams.tripId).then((result) => {
                this.trip = result.data[0];
                $rootScope.navTitle= this.trip.title;
            });

            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
            });


        }

        static
            controllerId:string = "TripCtrl";
    }
}
