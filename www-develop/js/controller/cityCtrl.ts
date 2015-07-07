module Controller {
    export class CityCtrl {

        cities:any = {};
        state;

        offerState = 'tab.offer';
        citySearchState = 'tab.search-city';
        searchState = 'tab.search';


        constructor(private DataService, private SearchService, private $ionicLoading, private $state, private TripService) {
            this.state = this.$state.current.name;
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            this.DataService.getAvailableCities().then((result) => {
                this.cities = result.data;
                this.$ionicLoading.hide();
            });
        }

        setCity(city) {
            if(this.state === this.citySearchState) {
                this.SearchService.setCity(city);
                this.$state.go(this.searchState);
            } else {
                this.TripService.setCity(city);
                this.$state.go(this.offerState);
            }
        }

        static
            controllerId:string = "CityCtrl";
    }
}
