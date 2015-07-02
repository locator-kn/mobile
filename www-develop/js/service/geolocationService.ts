module Service {
    export class GeolocationService {


        constructor(private $q, private $ionicLoading, private $ionicActionSheet) {
        }


        getCurrentLocation() {
            var q = this.$q.defer();
            var posOptions = {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true};
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            navigator.geolocation.getCurrentPosition((result) => {
                this.$ionicLoading.hide();
                q.resolve(result);
            }, (err) => {
                this.$ionicLoading.hide();
                q.reject(err)
            }, posOptions);

            return q.promise;
        }

        static serviceId:string = "GeolocationService";
    }
}
