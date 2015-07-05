module Controller {
    export class SelectLocationCtrl {
        myLocationsByCity:any = {};
        locationsByCity:any = {};

        cityId:string;

        myLocations:boolean = true;
        selectedLocations:number = 0;

        constructor(private LocationService, private $stateParams, private webPath, private $rootScope) {
            this.cityId = $stateParams.cityId;

            this.LocationService.getMyLocationsByCity(this.cityId).then((result) => {
                if (result.data.length === 0) {
                    // display all locations if no locationy by me available
                    this.myLocations = false;
                }
                this.myLocationsByCity = result.data;
            });

            this.LocationService.getLocationsByCity(this.cityId).then((result)=> {
                this.locationsByCity = result.data
            })
        }

        toogleSelect(location) {
            if(!location.selected){
                this.selectedLocations++;
            } else {
                this.selectedLocations--;
            }
            var newStatus = !location.selected;
            // if element public
            if (location.public) {
                // select from public array
                var cityElement = this.locationsByCity.filter((obj => {
                    return obj._id === location._id;
                }));
                cityElement[0].selected = newStatus;

                // if element my element
                if (location.userid === this.$rootScope.userID) {
                    // select from my array
                    var myElement = this.myLocationsByCity.filter((obj => {
                        return obj._id === location._id;
                    }));
                    myElement[0].selected = newStatus;
                }
            } else {
                // select from my array
                var myElement = this.myLocationsByCity.filter((obj => {
                    return obj._id === location._id;
                }));
                myElement[0].selected = newStatus;
            }
        }

        static controllerId:string = "SelectLocationCtrl";
    }
}
