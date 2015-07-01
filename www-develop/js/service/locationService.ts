module Service {
    export class LocationService {

        constructor(private $http, private basePath, private SearchService, private $q) {
        }


        getLocationsByUser(userId) {
            return this.$http.get(this.basePath + '/users/' + userId + '/locations');
        }

        getLocationsByTripId(tripId) {
            return this.$http.get(this.basePath + '/trips/' + tripId + '/locations');
        }

        getLocationById(locationId) {
            return this.$http.get(this.basePath + '/locations/' + locationId);
        }

        static serviceId:string = "LocationService";
    }
}
