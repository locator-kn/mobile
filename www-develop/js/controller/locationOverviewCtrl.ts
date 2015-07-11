module Controller {
    export class LocationOverviewCtrl {
        results:any;

        tripType = 'tab.search-result-locations';
        userType = 'tab.search-user-locations';
        myType = 'tab.profile-locations';


        state:string;
        locationSourceId:string;

        me:boolean = false;
        elementWidth:number;

        constructor(private $state, private $stateParams, private LocationService, private $ionicLoading, private webPath, private $window) {
            this.elementWidth = this.$window.innerWidth  - (80 + 32 + 10);

            this.state = this.$state.current.name;

            this.locationSourceId = $stateParams.locationSourceId;
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});

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
