module Controller {
    export class LocationCtrl {
        result:any;
        locationId:number;

        constructor(private $state, private $stateParams, private LocationService, private $ionicLoading, private webPath) {
            this.locationId = $stateParams.locationId;

            this.LocationService.getLocationById(this.locationId).then((result)=> {
                this.result = result.data;
            })

        }

        static controllerId:string = "LocationCtrl";
    }
}
