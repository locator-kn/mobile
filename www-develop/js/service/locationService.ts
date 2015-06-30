module Service {
    export class LocationService {

        constructor(private $http, private basePath) {
        }


        getLocationsByUser(userId) {
            return this.$http.get(this.basePath + '/users/' + userId + '/locations');
        }

        static serviceId:string = "LocationService";
    }
}
