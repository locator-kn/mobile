module Controller {
    export class SearchResultCtrl {
        results:any;

        moods:any = [];

        // TODO: to test
        witdh;

        constructor(private $rootScope, private ResultService, private $element, private DataService, private  $ionicLoading) {
            // css test TOOD: remove
            var elementWidth = angular.element(this.$element).width();
            this.witdh = elementWidth;
            angular.element(".tmpImageWidth").css({'width': elementWidth + "px"});

            this.results = ResultService.getResults();
            $rootScope.$on('newSearchResults', () => {
                this.results = ResultService.getResults();
                this.$ionicLoading.hide();
            });

            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
            });

        }

        static
            controllerId:string = "SearchResultCtrl";
    }
}
