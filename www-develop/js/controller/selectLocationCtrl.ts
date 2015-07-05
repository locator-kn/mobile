module Controller {
    export class SelectLocationCtrl {
        myLocationsByCity:any = {};
        locationsByCity:any = {};

        cityId:string;

        constructor(private LocationService, private $stateParams) {
            this.cityId = $stateParams.cityId;

            console.log(this.cityId);

            this.LocationService.getMyLocationsByCity(this.cityId).then((result) => {
                this.myLocationsByCity = result.data;
            });

            this.LocationService.getLocationsByCity(this.cityId).then((result)=> {
                this.locationsByCity = result.data
            })
        }

        static controllerId:string = "SelectLocationCtrl";
    }
}
