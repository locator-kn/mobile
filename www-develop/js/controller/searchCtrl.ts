module Controller {
    export class SearchCtrl {

        selectedDays:number = 1;
        availableDays:any = [];

        selectedPersons:number = 1;
        availablePersons:any = [];

        tripCities:any = [];

        constructor(private $scope, private $rootScope, private $element, private $state, private DataService) {
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
                });
        }

        static controllerId:string = "SearchCtrl";
    }
}
