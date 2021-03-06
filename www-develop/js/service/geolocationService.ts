declare var google;

module Service {
    export class GeolocationService {


        resultInfoObject:any = {};
        geoPosition:any = {};

        constructor(private $q, private $ionicLoading, private UtilityService, private $http, private basePath, private $rootScope) {
        }

        getCurrentLocation() {
            var q = this.$q.defer();

            var timeout = 15000;

            var posOptions = {maximumAge: 30000, timeout: timeout, enableHighAccuracy: true};
            navigator.geolocation.getCurrentPosition((result) => {
                this.$ionicLoading.hide();
                q.resolve(result);
            }, (err) => {
                this.$ionicLoading.hide();
                this.UtilityService.showErrorPopup('Überprüfe deine GPS Verbindung und versuche es erneut');
                q.reject(err)
            }, posOptions);

            return q.promise;
        }

        // by michaelknoch
        getCityByCoords(lat, long) {
            return this.$q((resolve, reject) => {

                var latlng = new google.maps.LatLng(lat, long);
                var geocoder = new google.maps.Geocoder();

                var geocoderRequestObject = {
                    location: latlng
                };

                geocoder.geocode(geocoderRequestObject, (result, status) => {

                    if (!status === google.maps.GeocoderStatus.OK) {
                        return reject();
                    }

                    return resolve(result);
                });

            });
        }

        getPlaceIdByAddress(address:string) {

            return this.$q((resolve, reject) => {

                var geocoder = new google.maps.Geocoder();

                var geocoderRequestObject = {
                    address: address
                };

                geocoder.geocode(geocoderRequestObject, (result, status) => {

                    if (!status === google.maps.GeocoderStatus.OK) {
                        return reject();
                    }

                    return resolve(result);
                });

            });


            //return this.$http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&sensor=true');
        }

        saveLocation(location, id?:string) {
            if (id) {
                return this.$http.put(this.basePath + '/users/my/locations/' + id, location);
            }
            return this.$http.post(this.basePath + '/users/my/locations', location)
        }

        setResultInfoObject(obj) {
            this.resultInfoObject = obj;
        }

        getResultInfoObject() {
            return this.resultInfoObject;
        }

        getGeoPosition() {
            return this.geoPosition;
        }

        setGeoPosition(geoPosition) {
            this.geoPosition = geoPosition;
            this.$rootScope.$emit('newGeoPosition');

        }

        static serviceId:string = "GeolocationService";
    }
}
