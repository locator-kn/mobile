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

        constructor(private $rootScope, private $scope, private DataService, private $state, private SearchService, private ResultService, private $ionicPopup) {
            this.DataService.getAvailableDays().then((result)=> {
                this.availableDays = result.data;
            });

            this.DataService.getAvailablePersons().then((result) => {
                this.availablePersons = result.data;
            });

            this.DataService.getAvailableMoods().then((result) => {
                this.availableMoods = result.data;
            });

            $rootScope.$on('newSearchCity', () => {
                this.city = this.SearchService.getCity();
            });

            $rootScope.$on('newSearchMoods', () => {
                this.selectedMoods = this.SearchService.getMoods();
            });

            this.updateCities();
        }

        updateCities = ()=> {
            if (this.tripCities <= 0) {
                this.DataService.getAvailableCities().then((result) => {
                        this.tripCities = result.data;
                    }
                );
            }
        };

        setCity(cityId) {
            var city = this.tripCities.filter(function (obj) {
                return obj.id == cityId;
            });
            this.tripCities = [];
            var cityTitle = city[0].title;
            angular.element(".city").val(cityTitle);
            this.city = cityTitle;
        }

        searchTrips() {
            if (this.isEmpty(this.city)) {
                var alertPopup = this.$ionicPopup.alert({
                    title: '',
                    template: 'Bitte eine Stadt auswählen.'
                });
                alertPopup.then(function (res) {
                    // do nothing
                });
                // break search
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

        static
            controllerId:string = "SearchCtrl";
    }
}
