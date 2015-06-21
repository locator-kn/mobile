module Controller {
    export class CityCtrl {

        cities:any = {};

        constructor(private DataService, private SearchService, private $ionicLoading) {
            this.DataService.getAvailableCities().then((result) => {
                this.cities = result.data;
                this.$ionicLoading.hide();
            });
        }

        setCity(city) {
            this.SearchService.setCity(city);
        }

        static
            controllerId:string = "CityCtrl";
    }
}
