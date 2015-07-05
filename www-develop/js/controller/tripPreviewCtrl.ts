module Controller {
    export class TripPreviewCtrl {

        trip:any = {};
        tripId:string;

        user:any = {};

        moods:any = [];

        constructor(private $scope, private $element, private $stateParams, private SearchService, private DataService,
                    private $ionicSlideBoxDelegate, private UserService, private $ionicLoading, private webPath) {
            // get trip by id from state param
            SearchService.getTripById(this.$stateParams.tripId).then((result) => {
                this.trip = result.data;
                if (this.trip.start_date && this.trip.end_date) {
                    // date format
                    this.trip.start_date = moment(new Date(this.trip.start_date)).format('L');
                    this.trip.end_date = moment(new Date(this.trip.end_date)).format('L');
                }
                // important for ion-slide!
                this.$ionicSlideBoxDelegate.update();
                // workaround, because title do not update in tripDetail.html
                $scope.navTitle = this.trip.title;

                this.UserService.getUser(this.trip.userid)
                    .then(result => {
                        this.user = result.data;
                        this.$ionicLoading.hide();
                    });
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
