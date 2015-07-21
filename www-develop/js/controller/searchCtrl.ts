module Controller {
    export class SearchCtrl {

        selectedDays:number;
        availableDays:any = [];

        selectedPersons:number;
        availablePersons:any = [];

        selectedMood:any = {};
        availableMoods:any = [];
        moodAvailable:boolean;

        accommodation:boolean;

        start_date:string;
        end_date:string;

        tripCities:any = [];
        city:any = {};
        onlyOneCity:boolean;

        constructor(private $rootScope, private DataService, private $state, private SearchService, private $ionicPopup, private $ionicLoading) {
            this.DataService.getAvailableDays().then((result)=> {
                this.availableDays = result.data;
            });

            this.DataService.getAvailablePersons().then((result) => {
                this.availablePersons = result.data;
            });

            this.DataService.getAvailableMoods().then((result) => {
                this.$ionicLoading.hide();
                this.availableMoods = result.data;
            });

            // if only one city available -> select city as default city
            this.DataService.getAvailableCities().then((result) => {
                if(result.data.length === 1) {
                    this.city = result.data[0];
                    this.onlyOneCity = true;
                }
            });

            $rootScope.$on('newSearchCity', () => {
                this.city = this.SearchService.getCity();
            });


            $rootScope.$on('newSearchMood', () => {
                this.selectedMood = this.SearchService.getMood();
                this.moodAvailable = true;
            });

        }


        searchTrips() {
            if (Controller.SearchCtrl.isEmpty(this.city)) {
                this.$ionicPopup.alert({title: 'Bitte eine Stadt auswählen.'});
                return;
            }

            var query = {
                city: this.city,
                days: this.selectedDays,
                persons: this.selectedPersons,
                moods: this.selectedMood,
                start_date: this.start_date,
                end_date: this.end_date
            };

            // check if start & end date is committed
            if (this.start_date && this.end_date) {
                if (this.end_date < this.start_date) {
                    this.$ionicPopup.alert({title: 'Startdatum muss vor dem Enddatum liegen.'});
                    return;
                }
                var currentDate = new Date();
                var start_date = new Date(this.start_date);
                var end_date = new Date(this.end_date);
                if(currentDate > start_date|| currentDate > end_date){
                    this.$ionicPopup.alert({title: 'Datum liegt in der Vergangenheit.'});
                    return;
                }

                query.start_date = start_date.toISOString();
                query.end_date = end_date.toISOString();
            }


            this.SearchService.setQuery(query);
            this.$state.go('tab.search-result');

        }

        static isEmpty(myObject) {
            for (var key in myObject) {
                if (myObject.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }

        static controllerId:string = "SearchCtrl";
    }
}
