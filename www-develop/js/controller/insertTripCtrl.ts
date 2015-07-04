module Controller {
    export class InsertTripCtrl {

        // trip
        city:any = {};
        start_date;
        end_date;
        selectedDays:number;
        selectedPersons:number;
        accommodation:boolean;
        selectedAccommodationEquipment:any = [];

        // static data
        availableDays:any = [];
        availablePersons:any = [];
        availableAccommodationEquipment:any = [];

        constructor(private $rootScope, private TripService, private DataService) {
            $rootScope.$on('newInsertTripCity', () => {
                this.city = this.TripService.getCity();
            });

            $rootScope.$on('newInsertTripAccommodationEquipment', () => {
                this.selectedAccommodationEquipment = this.TripService.getAccommodationEquipment();
            });


            this.DataService.getAvailableDays().then((result)=> {
                this.availableDays = result.data;
            });

            this.DataService.getAvailablePersons().then((result) => {
                this.availablePersons = result.data;
            });

            this.DataService.getAvailableAccommodationEquipment().then((result) => {
                this.availableAccommodationEquipment = result.data;
            });
        }

        static controllerId:string = "InsertTripCtrl";
    }
}
