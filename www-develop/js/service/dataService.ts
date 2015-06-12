module Service {
    export class DataService {

        dataCitiesCache;

        constructor(private $http, private basePath, private CacheFactory) {
            this.dataCitiesCache = CacheFactory.createCache('dataCities');
        }

        getCities() {
            return this.$http.get(this.basePath + '/data/cities', {cache: this.dataCitiesCache});
        }

        static serviceId:string = "DataService";
    }
}
