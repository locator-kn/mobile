module Service {
    export class ResultService {

        results:any;

        constructor(private $rootScope) {
        }


        setResults(results) {
            this.results = results;
            this.$rootScope.$emit('newSearchResults');
        }

        getResults() {
            return this.results;
        }

        static serviceId:string = "ResultService";
    }
}
