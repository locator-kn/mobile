module Controller {
    export class OptionCtrl {

        tripId:string;
        locations:any = {};
        constructor(private webPath, private TripService, private $ionicScrollDelegate) {
            // TODO check if location state or trip state
            var result = TripService.getResultInfoObject();
            this.tripId = result.tripId;
            this.locations = result.locations;

            this.$ionicScrollDelegate.scrollTop(true);

            //this.$window.location.reload(true);


        }

        static controllerId:string = "OptionCtrl";
    }
}
