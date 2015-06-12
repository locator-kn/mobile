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

            this.DataService.getCities()
                .then(result => {
                    this.tripCities = result.data;
                    this.searchCities = result.data;
                    console.log(this.tripCities);

                });
        }

        searchCity(searchFilter) {

            console.log('Searching cities for ' + searchFilter);

            // TODO: was macht q?
            var deferred = this.$q.defer();

            var matches = this.searchCities.filter(function (city) {
                if (city.title.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1) return true;
            });

            //$timeout(function () {
            //
            deferred.resolve(matches);
            this.tripCities = matches;
            //
            //}, 100);

            return deferred.promise;
        }

        //search() {
        //
        //    this.DataService.searchCities().then(
        //        function(matches) {
        //            this.tripCities = matches;
        //        }
        //    )
        //}

        static
            controllerId:string = "SearchCtrl";
    }
}
