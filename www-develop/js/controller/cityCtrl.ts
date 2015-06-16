module Controller {
    export class CityCtrl {

        cities:any = {};

        constructor(private $scope, private $rootScope, private $stateParams, private DataService, private SearchService) {
            this.DataService.getAvailableCities().then((result) => {
                this.cities = result.data;
            });
        }


        static
            controllerId:string = "CityCtrl";
    }
}
