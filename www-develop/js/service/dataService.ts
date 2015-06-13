module Service {
    export class DataService {

        dataCitiesCache;
        availableDays = [
            {value: 1, title: "1"},
            {value: 2, title: "2"},
            {value: 3, title: "3"},
            {value: 4, title: "3+"}
        ];

        availablePersons = [
            {value: 1, title: "1"},
            {value: 2, title: "2"},
            {value: 3, title: "3"},
            {value: 4, title: "4"},
            {value: 5, title: "4+"}
        ];


        constructor(private $http, private basePath, private CacheFactory) {
            this.dataCitiesCache = CacheFactory.createCache('dataCities');
        }

        getAvailableCities() {
            return this.$http.get(this.basePath + '/data/cities', {cache: this.dataCitiesCache});
        }

        getAvailableDays() {
            return this.availableDays;
        }

        getAvailablePersons() {
            return this.availablePersons;
        }


        static serviceId:string = "DataService";
    }
}
