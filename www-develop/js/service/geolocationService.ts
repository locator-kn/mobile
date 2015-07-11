module Service {
    export class GeolocationService {


        resultInfoObject:any = {};
        geoPosition:any = {};
        geoTry:number = 0;

        constructor(private $q, private $ionicLoading, private $ionicPopup, private $http, private basePath, private $rootScope) {
        }

        getCurrentLocation() {
            var q = this.$q.defer();

            var timeout = 5000;

            if (!this.geoTry) {
                // first time -> not so long, because user don't know that position will tracked if map starts
                timeout = 3000;
                this.geoTry++;
            }
            var posOptions = {maximumAge: 60000, timeout: 3000, enableHighAccuracy: true};
            navigator.geolocation.getCurrentPosition((result) => {
                this.$ionicLoading.hide();
                q.resolve(result);
            }, (err) => {
                this.$ionicLoading.hide();
                this.$ionicPopup.alert({title: 'Überprüfe deine GPS Verbindung und versuche es erneut'});
                q.reject(err)
            }, posOptions);

            return q.promise;
        }

        // by michaelknoch
        getCityByCoords(lat, long) {
            return this.$http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&sensor=true');
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
