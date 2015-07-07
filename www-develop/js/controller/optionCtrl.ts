module Controller {
    export class OptionCtrl {

        tripId:string;
        location:any = {};
        constructor(private webPath, private TripService, private $ionicScrollDelegate, private $window, private $state) {
            // TODO check if location state or trip state
            var result = TripService.getResultInfoObject();
            this.tripId = result.tripId;

            for (var first in result.locations) break;
            this.location = result.locations[first];

            this.$ionicScrollDelegate.scrollTop(true);

        }

        restart() {
            this.$state.go('tab.offer');
            this.$window.location.reload(true);
        }

        static controllerId:string = "OptionCtrl";
    }
}
