module Controller {
    export class LocationCtrl {
        results:any;
        locationId:number;

        constructor(private $state, private $stateParams, private LocationService, private $ionicLoading, private webPath) {
            this.locationId = $stateParams.locationId;
        }

        static controllerId:string = "LocationCtrl";
    }
}
