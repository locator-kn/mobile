module Controller {
    export class TripCtrl {

        trip:any = {};
        tripId:string;

        user:any = {};

        moods:any = [];

        constructor(private $scope, private $element, private $stateParams, private SearchService, private DataService,
                    private $ionicSlideBoxDelegate, private UserService, private $ionicLoading, private webPath,
                    maxSpinningDuration, private $rootScope, private MessengerService, private $state) {

            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: maxSpinningDuration});


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
            });
        }

        openConversationModal = () => {
            this.UserService.openConversationModal(this.user._id);
        };

        numberOfElelementsIn(obj) {
            return Object.keys(obj).length;
        }

        startConversation(user, trip) {
            if (!this.$rootScope.authenticated) {
                return this.UserService.openLoginModal();
            }

            this.UserService.getMe().then(me => {
                var participant = me.data;
                var msg = this.MessengerService.getInitMessage(user, trip, participant);
                this.MessengerService.startInitConversation(msg, user.id || user._id, trip._id || trip.id).then((result:any) => {
                    var conId = result.data.id;
                    this.$state.go('tab.messenger-messages', {opponentId: user._id, conversationId: conId});
                    //this.$rootScope.$broadcast('new_conversation');
                });
            });
        }


        static controllerId:string = "TripCtrl";
    }
}
