module Controller {
    export class InsertTripCtrl {

        // trip
        city:any = {};
        selectedDays:number;
        start_date;
        end_date;

        // static data
        availableDays:any = [];

        constructor(private $rootScope, private TripService, private DataService) {
            $rootScope.$on('newInsertTripCity', () => {
                this.city = this.TripService.getCity();
            });

            this.DataService.getAvailableDays().then((result)=> {
                this.availableDays = result.data;
            });
        }

        static controllerId:string = "InsertTripCtrl";
    }
}
