module Controller {
    export class LocationCtrl {
        result:any;
        locationId:number;

        user:any = {};

        state:string;
        onProfile:boolean;

        publicLocation:boolean;

        constructor(private UserService, private $scope, private $stateParams, private LocationService,
                    private $ionicLoading, private webPath, maxSpinningDuration, private $state) {
            this.locationId = $stateParams.locationId;
            this.state = this.$state.current.name;

            if (this.$state.current.name.indexOf('profile') > -1) {
                this.onProfile = true;
            }

            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: maxSpinningDuration});

            this.LocationService.getLocationById(this.locationId).then((result)=> {
                this.$ionicLoading.hide();
                this.result = result.data;
                this.result.create_date = moment(new Date(this.result.create_date)).format('L');
                this.publicLocation = this.result.public;

                // workaround, because title do not update in tripDetail.html
                $scope.navTitle = this.result.title;

                this.UserService.getUser(this.result.userid)
                    .then(result => {
                        this.user = result.data;
                        this.$ionicLoading.hide();
                    });
            })
        }


        togglePublic() {
            this.LocationService.togglePublicLocation(this.result._id);
        }

        static controllerId:string = "LocationCtrl";
    }
}
