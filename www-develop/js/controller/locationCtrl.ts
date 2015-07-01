module Controller {
    export class LocationCtrl {
        results:any;
        locationId:number;

        constructor(private $state, private $stateParams, private LocationService, private $ionicLoading, private webPath) {
            this.locationId = $stateParams.locationId;

            this.LocationService.getLocationById(this.locationId).then((result)=> {
                this.results = result.data;
            })

        }

        static controllerId:string = "LocationCtrl";
    }
}
