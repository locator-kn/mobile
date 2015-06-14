module Controller {
    export class SearchResultCtrl {
        results:any;


        constructor(private $scope, private $rootScope) {
            $rootScope.$on('newSearchResults', (scope, result) => {
                this.results = result;
            });
        }

        static
            controllerId:string = "SearchResultCtrl";
    }
}
