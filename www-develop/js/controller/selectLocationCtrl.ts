module Controller {
    export class SelectLocationCtrl {
        myLocationsByCity:any = {};
        locationsByCity:any = {};

        cityId:string;

        myLocations:boolean = true;
        selectedLocations:number = 0;
        elementWidth:number;


        edit:boolean;
        userId:string;
        tripId:string;

        constructor(private LocationService, private $stateParams, private webPath, private $state, private $rootScope,
                    private TripService, private $ionicLoading, maxSpinningDuration, private $window) {
            this.elementWidth = this.$window.innerWidth  - (80 + 32 + 10 + 20);
            this.cityId = $stateParams.cityId;

            // check if in edit mode
            if (this.$state.current.name.indexOf('edit') > -1) {
                this.edit = true;

                this.userId = $stateParams.userId;
                this.tripId = $stateParams.tripId;
            }

            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: maxSpinningDuration});
            this.LocationService.getMyLocationsByCity(this.cityId).then((result) => {
                this.$ionicLoading.hide();
                if (result.data.length === 0) {
                    // display all locations if no locationy by me available
                    this.myLocations = false;
                }
                this.myLocationsByCity = result.data;
            });

            this.LocationService.getLocationsByCity(this.cityId).then((result)=> {
                this.$ionicLoading.hide();
                this.locationsByCity = result.data;
                // TODO: add promise to call function after get of my locations and locationy by city
                this.updateSelection();
            });

            $rootScope.$on('resetTripData', () => {
                this.myLocationsByCity = {};
                this.locationsByCity = {};
                this.cityId = '';
                this.myLocations = true;
                this.selectedLocations = 0;
                this.edit = false;
                this.userId = '';
                this.tripId = '';
            });
        }


        updateSelection() {
            var locations = this.TripService.getLocations();
            for(var id in locations) {
                this.LocationService.getLocationById(id).then((result) => {
                    this.toogleSelect(result.data);
                })
            }
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
            if(!this.edit) {
                this.$state.go('tab.offer-preview');
            } else {
                this.$state.go('tab.profile-trip-edit-preview', {
                    userId: this.userId,
                    tripId: this.tripId
                });
            }
        }

        static controllerId:string = "SelectLocationCtrl";
    }
}
