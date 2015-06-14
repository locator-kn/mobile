module Controller {
    export class SearchResultCtrl {
        results:any;


        constructor(private $scope, private $rootScope, private ResultService) {
            this.results = ResultService.getResults();

            $rootScope.$on('newSearchResults', () => {
                this.results = ResultService.getResults();
            });

        }

        static
            controllerId:string = "SearchResultCtrl";
    }
}
