module Service {
    export class GeolocationService {


        constructor(private $q) {
        }


        getCurrentLocation() {
            var q = this.$q.defer();

            var posOptions = {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true};
            navigator.geolocation.getCurrentPosition((result) => {
                // Do any magic we need
                q.resolve(result);
            }, (err) => {
                q.reject(err)
            }, posOptions);

            return q.promise;
        }

        static
            serviceId:string = "GeolocationService";
    }
}
