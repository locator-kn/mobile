module Controller {
    export class LocationCtrl {
        result:any;
        locationId:number;

        user:any = {};

        constructor(private UserService, private $stateParams, private LocationService, private $ionicLoading, private webPath) {
            this.locationId = $stateParams.locationId;

            this.LocationService.getLocationById(this.locationId).then((result)=> {
                this.result = result.data;

                this.UserService.getUser(this.result.userid)
                    .then(result => {
                        this.user = result.data;
                        this.$ionicLoading.hide();
                    });
            })

        }

        static controllerId:string = "LocationCtrl";
    }
}
