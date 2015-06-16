module Controller {
    export class SearchCtrl {

        selectedDays:number ;
        availableDays:any = [];

        selectedPersons:number;
        availablePersons:any = [];

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
                console.log('new city: ' + this.city.title)

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
            var query = {
                city: this.city,
                days: this.selectedDays,
                persons: this.selectedPersons
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
