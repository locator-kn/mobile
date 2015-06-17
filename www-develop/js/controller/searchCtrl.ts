module Controller {
    export class SearchCtrl {

        selectedDays:number;
        availableDays:any = [];

        selectedPersons:number;
        availablePersons:any = [];

        selectedMoods:any = [];

        accommodation:boolean;

        start_date:string;
        end_date:string;

        tripCities:any = [];
        city:any = {};

        constructor(private $rootScope, private DataService, private SearchService, private ResultService) {
            this.DataService.getAvailableDays().then((result)=> {
                this.availableDays = result.data;
            });

            this.DataService.getAvailablePersons().then((result) => {
                this.availablePersons = result.data;
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
            var moodQueryArray = [];
            for (var mood in this.selectedMoods) {
                moodQueryArray.push(this.selectedMoods[mood].query_name);
            }

            var query = {
                city: this.city,
                days: this.selectedDays,
                persons: this.selectedPersons,
                moods: moodQueryArray,
                start_date: new Date(this.start_date).toISOString(),
                end_date: new Date(this.end_date).toISOString()
            };

            console.log(query);

            this.SearchService.getTripsByQuery(query).then(result => {
                this.ResultService.setResults(result.data);
            });
        }

        static
            controllerId:string = "SearchCtrl";
    }
}
