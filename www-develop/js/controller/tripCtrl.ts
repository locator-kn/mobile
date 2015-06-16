module Controller {
    export class TripCtrl {

        trip:any = {};
        tripId:string;

        constructor(private $scope, private $rootScope, private $stateParams, private $state, private SearchService) {
            // get trip by id from state param
            SearchService.getTripById(this.$stateParams.tripId).then((result) => {
                this.trip = result.data;
            });

        }

        static
            controllerId:string = "TripCtrl";
    }
}
