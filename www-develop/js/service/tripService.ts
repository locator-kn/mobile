module Service {
    export class TripService {

        constructor(private $http, private basePath) {
        }

        getMyTrips() {
            return this.$http.get(this.basePath + '/users/my/trips');
        }

        getTripsByUser(userid) {
            return this.$http.get(this.basePath + '/users/' + userid + '/trips');
        }

        static serviceId:string = "TripService";
    }
}
