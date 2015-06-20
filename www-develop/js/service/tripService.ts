module Service {
    export class TripService {

        constructor(private $http, private basePath) {
        }

        getTripsByUser(userid) {
            return this.$http.get(this.basePath + '/users/' + userid + '/trips');
        }

        static serviceId:string = "TripService";
    }
}
