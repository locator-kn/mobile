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
        edit:boolean;

        // info
        moodAvailable:boolean;
        selectLocationState:string = 'tab.offer-locations';
        onlyOneCity:boolean;

        tripId:string;
        userId:string;

        constructor(private $rootScope, private TripService, private DataService, private $state,
                    private $ionicScrollDelegate, private $ionicPopup, private SearchService, private $stateParams) {

            // check if in edit mode
            if (this.$state.current.name.indexOf('edit') > -1) {
                this.edit = true;

                this.userId = $stateParams.userId;
                this.tripId = $stateParams.tripId;

                this.SearchService.getTripById($stateParams.tripId).then((result) => {
                    this.city = result.data.city;
                    if(result.data.start_date && result.data.end_date) {
                        this.start_date = new Date(result.data.start_date);
                    }
                    this.end_date = new Date(result.data.end_date);
                    this.selectedDays = result.data.days;
                    this.selectedPersons = result.data.persons;
                    this.accommodation = result.data.accommodation;
                    // TODO: get objects form query_name
                    //this.selectedAccommodationEquipment:any = [];
                    //this.selectedMood:any = {};
                    // this._id
                    // this._rev
                });
            }

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

            // TODO add _id and _rev to document

            this.TripService.setPreTrip(trip);

            if(!this.edit) {
                this.$state.go('tab.offer-locations', {
                    cityId: this.city.place_id
                });
            } else {
                this.$state.go('tab.profile-trip-edit-locations', {
                    cityId: this.city.place_id,
                    tripId: this.tripId,
                    userId: this.userId
                });
            }

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
            this.edit = false;
        };

        triggerAccomodation() {
            this.accommodation = !this.accommodation;
            if (this.accommodation) {
                this.$ionicScrollDelegate.scrollBottom(true);
            }
        }

        selectCity() {
            if (!this.edit) {
                this.$state.go('tab.offer-city');
            } else {
                this.$state.go('tab.profile-trip-edit-city', {
                    tripId: this.tripId,
                    userId: this.userId
                })
            }
        }

        selectMood() {
            if (!this.edit) {
                this.$state.go('tab.offer-moods');
            } else {
                this.$state.go('tab.profile-trip-edit-moods', {
                    tripId: this.tripId,
                    userId: this.userId
                })
            }
        }

        static controllerId:string = "InsertTripCtrl";
    }
}
