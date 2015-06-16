module Controller {
    export class CityCtrl {

        cities:any = {};

        constructor(private DataService, private SearchService) {
            this.DataService.getAvailableCities().then((result) => {
                this.cities = result.data;
            });
        }

        setCity(city) {
            this.SearchService.setCity(city);
        }

        static
            controllerId:string = "CityCtrl";
    }
}
