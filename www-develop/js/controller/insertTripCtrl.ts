module Controller {
    export class InsertTripCtrl {

        // trip
        city:any = {};
        start_date;
        end_date;
        selectedDays:number;
        selectedPersons:number;
        accommodation:boolean = false;
        selectedAccommodationEquipment:any = [];
        selectedMood:any = {};

        // static data
        availableDays:any = [];
        availablePersons:any = [];
        availableAccommodationEquipment:any = [];
        availableMoods:any = {};

        undef;

        // info
        moodAvailable:boolean;
        selectLocationState:string = 'tab.offer-locations';
        onlyOneCity:boolean;

        constructor(private $rootScope, private TripService, private DataService, private $state,
                    private $ionicScrollDelegate, private $ionicPopup) {
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

            $rootScope.$on('resetTripData', () => {
                this.resetData();
            });

            this.DataService.getAvailableDays().then((result)=> {
                this.availableDays = result.data;
                // random selection
                var day = result.data[Math.floor(Math.random() * result.data.length)];
                this.selectedDays = day.value;

            });

            this.DataService.getAvailablePersons().then((result) => {
                this.availablePersons = result.data;
            });

            this.DataService.getAvailableAccommodationEquipment().then((result) => {
                this.availableAccommodationEquipment = result.data;
            });

            // if only one city available -> select city as default city
            this.DataService.getAvailableCities().then((result) => {
                if (result.data.length === 1) {
                    this.city = result.data[0];
                    this.onlyOneCity = true;
                }
            });

            // random mood selection
            this.DataService.getAvailableMoods().then((result) => {
                var mood = result.data[Math.floor(Math.random() * result.data.length)];
                this.TripService.setMood(mood);
            })
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
            debugger;
            if (dateString !== undefined) {
                var date = new Date(dateString);
                return date.toISOString();
            }
            return dateString;
        }

        selectLocations = () => {
            // check if start & end date is committed
            if (this.start_date && this.end_date) {
                if (this.end_date < this.start_date) {
                    this.$ionicPopup.alert({title: 'Startdatum muss vor dem Enddatum liegen.'});
                    return;
                }
                var currentDate = new Date();
                var start_date = new Date(this.start_date);
                var end_date = new Date(this.end_date);
                if (currentDate > start_date || currentDate > end_date) {
                    this.$ionicPopup.alert({title: 'Datum liegt in der Vergangenheit.'});
                    return;
                }
            }

            var trip = {
                title: '',
                accommodation: this.accommodation,
                accommodation_equipment: this.getQueryNameArrayOf(this.selectedAccommodationEquipment),
                city: this.city,
                days: this.selectedDays,
                moods: this.getQueryNameArrayOf(this.selectedMood),
                start_date: this.undef,
                end_date: this.undef,
                persons: this.undef
            };

            if (this.start_date && this.end_date && !(this.start_date === '' || this.end_date === '')) {
                trip.start_date = this.toIsoDate(this.start_date);
                trip.end_date = this.toIsoDate(this.end_date)
            }

            if (this.selectedPersons > 0) {
                trip.persons = this.selectedPersons;
            }

            this.TripService.setPreTrip(trip);

            this.$state.go('tab.offer-locations', {
                cityId: this.city.place_id
            });
        };

        resetData = () => {
            // trip
            this.city = {};
            this.start_date = '';
            this.end_date = '';
            this.selectedDays = 0;
            this.selectedPersons = 0;
            this.accommodation = false;
            this.selectedAccommodationEquipment = [];
            this.selectedMood = {};
        };

        triggerAccomodation() {
            this.accommodation = !this.accommodation;
            if (this.accommodation) {
                this.$ionicScrollDelegate.scrollBottom(true);
            }
        }

        static controllerId:string = "InsertTripCtrl";
    }
}
