module Service {
    export class ResultService {

        results:any;

        constructor(private $http, private $rootScope, private basePath, private CacheFactory, private lodash, private DataService, private $q) {
        }



        setResults(results) {
            this.results = results;
            this.$rootScope.$emit('newSearchResults');
        }

        getResults() {
            return this.results;
        }

        static
            serviceId:string = "ResultService";
    }
}
