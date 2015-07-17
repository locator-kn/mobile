module Controller {
    export class TripPreviewCtrl {

        trip:any = {};
        user:any = {};
        moods:any = [];
        selectedMood:any = {};
        start_date;
        end_date;

        error:boolean;

        constructor(private TripService, private $ionicSlideBoxDelegate, private $state, private UserService,
                    private DataService, private $ionicLoading, private webPath, private $rootScope) {
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
                this.start_date = moment(new Date(this.trip.start_date)).format('L');
                this.end_date = moment(new Date(this.trip.end_date)).format('L')
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
                for (var first in this.trip.locations) break;
                var location = this.trip.locations[first];
                var info = {
                    tripId: result.data.id,
                    picture: location.picture + '?size=mobile'
                };
                this.TripService.setResultInfoObject(info);
                this.$state.go('tab.offer-options');
                this.$rootScope.$emit('resetTripData');
                this.resetData();
            }).catch((err)=> {
                console.log(err);
            })
        }

        resetData() {
            this.trip = {};
            this.user = {};
            this.moods = [];
            this.selectedMood = {};
            this.error = false;
            this.start_date = '';
            this.start_date = '';
        }

        static controllerId:string = "TripPreviewCtrl";
    }
}
