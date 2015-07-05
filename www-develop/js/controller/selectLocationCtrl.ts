module Controller {
    export class SelectLocationCtrl {
        myLocationsByCity:any = {};
        locationsByCity:any = {};

        cityId:string;

        myLocations:boolean = true;

        constructor(private LocationService, private $stateParams, private webPath) {
            this.cityId = $stateParams.cityId;

            this.LocationService.getMyLocationsByCity(this.cityId).then((result) => {
                if(result.data.length === 0) {
                    // display all locations if no locationy by me available
                    this.myLocations = false;
                }
                this.myLocationsByCity = result.data;
            });

            this.LocationService.getLocationsByCity(this.cityId).then((result)=> {
                this.locationsByCity = result.data
            })
        }

        static controllerId:string = "SelectLocationCtrl";
    }
}
