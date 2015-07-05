module Controller {
    export class SelectLocationCtrl {
        myLocationsByCity:any = {};
        locationsByCity:any = {};

        cityId:string;

        myLocations:boolean = true;
        selectedLocations:number = 0;

        constructor(private LocationService, private $stateParams, private webPath, private $state, private $rootScope, private TripService) {
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
            if (!location.selected) {
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

        getSelectedLocations = () => {
            var publicLocations = this.locationsByCity.filter((obj => {
                return obj.selected === true;
            }));
            var privateLocations = this.myLocationsByCity.filter((obj => {
                return ((obj.selected === true) && (obj.public === false));
            }));

            var locations = {};
            var index;
            for (index = 0; index < publicLocations.length; ++index) {
                locations[publicLocations[index]._id] = publicLocations[index].images;
            }
            for (index = 0; index < privateLocations.length; ++index) {
                locations[privateLocations[index]._id] = privateLocations[index].images;
            }
            return locations;
        };

        tripPreview() {
            this.TripService.setLocations(this.getSelectedLocations());
            console.log('ab zur preview');
            //this.$state.go('tab.offer-locations', {
            //    cityId: this.city.place_id
            //});
        }

        static controllerId:string = "SelectLocationCtrl";
    }
}
