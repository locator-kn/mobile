module Controller {
    export class SearchCtrl {

        selectedDays:number = 1;
        availableDays:any = [];

        selectedPersons:number = 1;
        availablePersons:any = [];

        tripCities:any = [];
        city:string;

        constructor(private $scope, private $rootScope, private $element, private $state, private DataService) {
            this.availableDays = this.DataService.getAvailableDays();
            this.availablePersons = this.DataService.getAvailablePersons();
        }

        searchCity(searchFilter) {
            console.log('Searching cities for ' + searchFilter);

            this.DataService.getCities()
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
            angular.element(".city").val(city[0].title);
            this.city = cityId;
        }

        static
            controllerId:string = "SearchCtrl";
    }
}
