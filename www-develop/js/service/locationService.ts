module Service {
    export class LocationService {

        constructor(private $http, private basePath, private SearchService, private $q) {
        }


        getLocationsByUser(userId) {
            return this.$http.get(this.basePath + '/users/' + userId + '/locations');
        }

        getLocationsByTripId(tripId) {
            var q = this.$q.defer();

            this.SearchService.getTripById(tripId).then((result) => {
                var locations = [];
                for (var location in result.data.locations) {
                    var promise = this.$http.get(this.basePath + '/locations/' + location);
                    locations.push(promise);
                }
                this.$q.all(locations).then((data) => {
                    var result = {
                        data: []
                    };
                    var index;
                    for (index = 0; index < data.length; ++index) {
                        result.data.push(data[index].data);
                    }
                    q.resolve(result)
                });
            });
            return q.promise;
        }

        getLocationById(locationId) {
            return this.$http.get(this.basePath + '/locations/' + locationId);
        }

        static serviceId:string = "LocationService";
    }
}
