module Controller {
    export class TripCtrl {

        constructor(private $scope, private $rootScope, private $stateParams, private $state) {
            console.log(this.$stateParams.tripId)
        }

        static
            controllerId:string = "TripCtrl";
    }
}
