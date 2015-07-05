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
        selectedMood:any = {};

        // static data
        availableDays:any = [];
        availablePersons:any = [];
        availableAccommodationEquipment:any = [];
        availableMoods:any = {};

        // info
        moodAvailable:boolean;
        selectLocationState:string = 'tab.offer-locations';

        constructor(private $rootScope, private TripService, private DataService, private $state) {
            $rootScope.$on('newInsertTripCity', () => {
                this.city = this.TripService.getCity();
            });

            $rootScope.$on('newInsertTripAccommodationEquipment', () => {
                this.selectedAccommodationEquipment = this.TripService.getAccommodationEquipment();
            });

            $rootScope.$on('newInsertTripMood', () => {
                this.selectedMood = this.TripService.getMood();
                this.moodAvailable = true;
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

        getQueryNameArrayOf(array) {
            var equipmentArray = [];
            var index;
            for (index = 0; index < array.length; ++index) {
                equipmentArray.push(array[index].query_name);
            }
            return equipmentArray;
        }

        toIsoDate(dateString) {
            if (dateString !== '') {
                var date = new Date(dateString);
                return date.toISOString();
            }
            return dateString;
        }

        selectLocations = () => {
             var trip = {
                title: '',
                accommodation: this.accommodation,
                accommodation_equipment: this.getQueryNameArrayOf(this.selectedAccommodationEquipment),
                city: this.city,
                days: this.selectedDays,
                moods: this.getQueryNameArrayOf(this.selectedAccommodationEquipment),
                start_date: this.toIsoDate(this.start_date),
                end_date: this.toIsoDate(this.end_date),
                persons: this.selectedPersons
            };

            this.TripService.setPreTrip(trip);

            this.$state.go('tab.offer-locations', {
                cityId: this.city.place_id
            });
        };

        static controllerId:string = "InsertTripCtrl";
    }
}
