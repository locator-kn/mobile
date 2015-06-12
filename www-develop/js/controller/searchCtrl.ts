module Controller {
    export class SearchCtrl {

        selectedDays:number = 1;
        availableDays:any = [];

        selectedPersons:number = 1;
        availablePersons:any = [];

        tripCities:any = [];
        searchCities:any = [];

        constructor(private $scope, private $rootScope, private $element, private $state, private DataService, private $q) {
            this.availableDays = [
                {value: 1, title: "1"},
                {value: 2, title: "2"},
                {value: 3, title: "3"},
                {value: 4, title: "3+"}
            ];
            this.availablePersons = [
                {value: 1, title: "1"},
                {value: 2, title: "2"},
                {value: 3, title: "3"},
                {value: 4, title: "4"},
                {value: 5, title: "4+"}
            ];

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

        static
            controllerId:string = "SearchCtrl";
    }
}
