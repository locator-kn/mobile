module Service {
    export class GeolocationService {


        constructor(private $q, private $ionicLoading, private $ionicPopup, private $http) {
        }


        getCurrentLocation() {
            var q = this.$q.defer();
            var posOptions = {maximumAge: 4000, timeout: 6000, enableHighAccuracy: true};
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            navigator.geolocation.getCurrentPosition((result) => {
                this.$ionicLoading.hide();
                q.resolve(result);
            }, (err) => {
                this.$ionicLoading.hide();
                this.$ionicPopup.show({title: 'Überprüfe deine GPS Verbindung und versuche es erneut'});
                q.reject(err)
            }, posOptions);

            return q.promise;
        }

        // by michaelknoch
        getCityByCoords(lat, long) {
            return this.$http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&sensor=true');
        }

        static serviceId:string = "GeolocationService";
    }
}
