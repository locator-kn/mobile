module Controller {
    export class SearchResultCtrl {
        results:any;


        constructor(private $scope, private $rootScope, private ResultService, private $element) {
            // css test TOOD: remove
            var elementWidth = angular.element(this.$element).width();
            angular.element(".tmpImageWidth").css({'width': elementWidth + "px"})

            this.results = ResultService.getResults();
            $rootScope.$on('newSearchResults', () => {
                this.results = ResultService.getResults();
            });

        }

        static
            controllerId:string = "SearchResultCtrl";
    }
}
