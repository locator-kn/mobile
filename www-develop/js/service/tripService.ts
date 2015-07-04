module Service {
    export class TripService {

        // create trip
        city:any={};

        constructor(private $http, private basePath, private $ionicLoading, private $rootScope) {
        }

        getTripsByUser(userid) {
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            return this.$http.get(this.basePath + '/users/' + userid + '/trips');
        }

        setCity(city) {
            this.city = city;
            this.$rootScope.$emit('newInsertTripCity');
        }

        getCity() {
            return this.city;
        }

        static serviceId:string = "TripService";
    }
}
