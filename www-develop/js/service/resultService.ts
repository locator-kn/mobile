module Service {
    export class ResultService {

        results:any;
        filterSearchValues:any = {};

        constructor(private $rootScope) {
        }


        setResults(results) {
            this.results = results;
            this.$rootScope.$emit('newSearchResults');
        }

        getResults() {
            return this.results;
        }

        setFilterSearchValues(filterSearchValues) {
            this.filterSearchValues = filterSearchValues;
        }

        getFilterSearchValues() {
            return this.filterSearchValues;
        }

        static serviceId:string = "ResultService";
    }
}
