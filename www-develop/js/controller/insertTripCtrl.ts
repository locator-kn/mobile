module Controller {
    export class InsertTripCtrl {

        // trip
        city:any = {};
        start_date;
        end_date;
        selectedDays:number;
        selectedPersons:number;

        // static data
        availableDays:any = [];
        availablePersons:any = [];

        constructor(private $rootScope, private TripService, private DataService) {
            $rootScope.$on('newInsertTripCity', () => {
                this.city = this.TripService.getCity();
            });

            this.DataService.getAvailableDays().then((result)=> {
                this.availableDays = result.data;
            });

            this.DataService.getAvailablePersons().then((result) => {
                this.availablePersons = result.data;
            });

        }

        static controllerId:string = "InsertTripCtrl";
    }
}
