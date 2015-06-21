module Controller {
    export class SearchCtrl {

        selectedDays:number;
        availableDays:any = [];

        selectedPersons:number;
        availablePersons:any = [];

        selectedMoods:any = [];
        availableMoods:any = [];

        accommodation:boolean;

        start_date:string;
        end_date:string;

        tripCities:any = [];
        city:any = {};

        constructor(private $rootScope, private DataService, private $state, private SearchService, private ResultService, private $ionicPopup, private $ionicLoading) {
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

            $rootScope.$on('newSearchCity', () => {
                this.city = this.SearchService.getCity();
            });

            $rootScope.$on('newSearchMoods', () => {
                this.selectedMoods = this.SearchService.getMoods();
            });

        }


        searchTrips() {
            if (this.isEmpty(this.city)) {
                this.$ionicPopup.alert({title: 'Bitte eine Stadt auswählen.'});
                return;
            }

            var moodQueryArray = [];
            for (var mood in this.selectedMoods) {
                moodQueryArray.push(this.selectedMoods[mood].query_name);
            }

            var query = {
                city: this.city,
                days: this.selectedDays,
                persons: this.selectedPersons,
                moods: moodQueryArray,
                start_date: '',
                end_date: ''
            };

            // check if start & end date is committed
            if (this.start_date && this.end_date) {
                if (this.end_date < this.start_date) {
                    this.$ionicPopup.alert({title: 'Startdatum muss vor dem Enddatum liegen.'});
                    return;
                }
                query.start_date = new Date(this.start_date).toISOString();
                query.end_date = new Date(this.end_date).toISOString();
            }


            this.SearchService.getTripsByQuery(query).then(result => {
                this.ResultService.setResults(result.data);
            });
            this.$state.go('tab.search-result');

        }

        isEmpty(myObject) {
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
