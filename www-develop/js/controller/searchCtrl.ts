module Controller {
    export class SearchCtrl {

        selectedDays:number = 1;
        availableDays:any = [];

        selectedPersons:number = 1;
        availablePersons:any = [];

        tripCities:any = [];
        city:string;

        constructor(private $scope, private $rootScope, private $element, private $state, private DataService, private SearchService, private $ionicHistory) {
            this.availableDays = this.DataService.getAvailableDays();
            this.availablePersons = this.DataService.getAvailablePersons();

        }

        searchCity(searchFilter) {
            console.log('Searching cities for ' + searchFilter);

            this.DataService.getAvailableCities()
                .then(result => {
                    this.tripCities = result.data.filter(function (city) {
                        if (city.title.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1) return true;
                    });
                });
        }

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

            this.SearchService.getTripsByQuery(query);


        }

        static
            controllerId:string = "SearchCtrl";
    }
}
