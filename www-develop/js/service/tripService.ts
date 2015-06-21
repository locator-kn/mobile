module Service {
    export class TripService {

        constructor(private $http, private basePath, private $ionicLoading) {
        }

        getTripsByUser(userid) {
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            return this.$http.get(this.basePath + '/users/' + userid + '/trips');
        }

        static serviceId:string = "TripService";
    }
}
