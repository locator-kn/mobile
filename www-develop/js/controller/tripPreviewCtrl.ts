module Controller {
    export class TripPreviewCtrl {

        trip:any = {};
        user:any = {};
        moods:any = [];
        selectedMood:any = {};

        error:boolean;

        constructor(private TripService, private $ionicSlideBoxDelegate, private $state, private UserService,
                    private DataService, private $ionicLoading, private webPath) {
            this.trip = TripService.getPreTrip();
            this.trip.locations = TripService.getLocations();

            var mood = TripService.getMood();
            this.trip.moods = [];
            this.trip.moods.push(mood.query_name);
            this.selectedMood = mood;

            // fixes
            delete this.trip.city.total;

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

        createTrip() {
            // check required fields
            if (!this.trip.title
                || !this.trip.description) {
                this.error = true;
                return;
            }

            this.TripService.createTrip(this.trip).then((result) => {
                for (var first in result.locations) break;
                var location = result.locations[first];

                var info = {
                    tripId: result.data.id,
                    picture: location.picture
                };
                this.TripService.setResultInfoObject(info);
                this.$state.go('tab.offer-options');
            }).catch((err)=> {
                console.log(err);
            })
        }

        clearData() {
            this.trip = {};
            this.user = {};
            this.moods = [];
            this.error = false;
            this.TripService.clearData();
        }

        static controllerId:string = "TripPreviewCtrl";
    }
}
