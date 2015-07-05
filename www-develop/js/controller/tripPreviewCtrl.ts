module Controller {
    export class TripPreviewCtrl {

        trip:any = {};
        user:any = {};
        moods:any = [];

        constructor(private TripService, private $ionicSlideBoxDelegate, private $scope, private UserService,
                    private DataService, private $ionicLoading, private webPath) {
            this.trip = TripService.getPreTrip();
            this.trip.locations = TripService.getLocations();
            this.trip.moods = TripService.getMood();

            if (this.trip.start_date && this.trip.end_date) {
                // date format
                this.trip.start_date = moment(new Date(this.trip.start_date)).format('L');
                this.trip.end_date = moment(new Date(this.trip.end_date)).format('L');
            }

            // important for ion-slide!
            this.$ionicSlideBoxDelegate.update();

            this.UserService.getMe()
                .then(result => {
                    this.user = result.data;
                    this.$ionicLoading.hide();
                });

            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
                this.$ionicLoading.hide();
            });
        }


        numberOfElelementsIn(obj) {
            return Object.keys(obj).length;
        }

        static controllerId:string = "TripPreviewCtrl";
    }
}
