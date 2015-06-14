module Service {
    export class ResultService {

        results:any;

        constructor(private $http, private $rootScope, private basePath, private CacheFactory, private lodash, private DataService, private $q) {
        }





        static
            serviceId:string = "ResultService";
    }
}
