module Controller {
    export class InsertTripCtrl {

        // trip
        city:any = {};

        constructor(private $rootScope, private TripService) {
            $rootScope.$on('newInsertTripCity', () => {
                this.city = this.TripService.getCity();
            });
        }

        static controllerId:string = "InsertTripCtrl";
    }
}
