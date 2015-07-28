module Controller {
    export class LocationOverviewCtrl {
        results:any;

        tripType = 'tab.search-result-locations';
        tripUserType = 'tab.profile-trip-locations';
        userType = 'tab.search-user-locations';
        myType = 'tab.profile-locations';


        state:string;
        locationSourceId:string;

        me:boolean = false;
        elementWidth:number;

        constructor(private $state, private $stateParams, private LocationService, private $ionicLoading,
                    private webPath, private $window, maxSpinningDuration) {

            this.elementWidth = this.$window.innerWidth  - (80 + 32 + 10 + 15);

            this.state = this.$state.current.name;

            this.locationSourceId = $stateParams.locationSourceId;
            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: maxSpinningDuration});

            if (this.state === this.tripType || this.state === this.tripUserType) {
                this.LocationService.getLocationsByTripId(this.locationSourceId).then((result) => {
                    this.results = result.data;
                    this.$ionicLoading.hide();
                }).catch((err) => {
                    console.log(err);
                    this.$ionicLoading.hide();
                });
                if(this.state === this.tripUserType){
                    this.me = true;
                }
            } else if (this.state === this.userType) {
                // if location by user x
                this.LocationService.getLocationsByUser(this.locationSourceId).then((result) => {
                    this.results = result.data;
                    this.$ionicLoading.hide();
                }).catch((err) => {
                    console.log(err);
                    this.$ionicLoading.hide();
                });
            } else if (this.state === this.myType) {
                this.me = true;
                this.LocationService.getMyLocations().then((result) => {
                    this.results = result.data;
                    this.$ionicLoading.hide();
                }).catch((err) => {
                    console.log(err);
                    this.$ionicLoading.hide();
                });
            }


        }

        static controllerId:string = "LocationOverviewCtrl";
    }
}
