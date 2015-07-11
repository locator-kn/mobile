module Service {
    export class ResultService {

        results:any;
        queryParams: any;

        constructor(private $rootScope) {
        }


        setResults(results) {
            this.results = results;
            this.$rootScope.$emit('newSearchResults');
        }

        getResults() {
            return this.results;
        }

        setQueryParams(queryParams) {
            this.queryParams = queryParams;
        }

        getQueryParams() {
            return this.queryParams;
        }

        static serviceId:string = "ResultService";
    }
}
