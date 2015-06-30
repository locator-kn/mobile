module Controller {
    export class LocationOverviewCtrl {
        results:any;

        tripType = 'tab.search-result-locations';
        userType = 'tab.search-user-locations';
        myType = 'tab.profile-locations';


        state:string;
        locationSourceId:string;

        me:boolean = false;

        // ++++++++ TODO +++++++++++++++++
        // - location by user x
        // - location by my
        // - location by city
        // - location by trip
        // +++++++++++++++++++++++++++++++

        constructor(private $state, private $stateParams, private LocationService, private $ionicLoading, private webPath) {
            this.state = this.$state.current.name;

            this.locationSourceId = $stateParams.locationSourceId;

            if (this.state === this.tripType) {
                this.LocationService.getLocationsByTripId(this.locationSourceId).then((result) => {
                    this.results = result.data;
                    this.$ionicLoading.hide();
                }).catch((err) => {
                    console.log(err);
                    this.$ionicLoading.hide();
                });
            } else if (this.state === this.userType) {
                // if location by user x
                this.LocationService.getLocationsByUser(this.locationSourceId).then((result) => {
                    this.results = result.data;
                    this.$ionicLoading.hide();
                }).catch((err) => {
                    console.log(err);
                    this.$ionicLoading.hide();
                });
            } else if (this.state === this.myType){
                this.me = true;
                // TODO get my locations
            }


        }

        static controllerId:string = "LocationOverviewCtrl";
    }
}
