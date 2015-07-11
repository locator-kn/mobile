module Service {
    export class TripService {

        preTrip:any = {};
        locations:any = [];

        // create trip
        city:any = {};
        accommodationEquipment:any = [];
        mood:any = [];

        resultInfoObject:any = {};

        constructor(private $http, private basePath, private $ionicLoading, private $rootScope) {
        }

        createTrip(trip) {
            return this.$http.post(this.basePath + '/trips', trip);
        }

        getNextTripsFromUser(userId, pageNumber?, pageSize?) {
            if(pageNumber && pageSize) {
                // returning a promise inside a promise will make the outside promise resolving if inside is resolved.
                return this.$http({
                    url: this.basePath + '/users/' + userId + '/trips',
                    params: {
                        page: (pageNumber || ''),
                        page_size: (pageSize || '')
                    },
                    method: 'GET'
                });
            } else {
                return this.$http.get(this.basePath + '/users/' + userId + '/trips');
            }

        }
        // @deprecated
        getTripsByUser(userid) {
            return this.$http.get(this.basePath + '/users/' + userid + '/trips');
        }

        setCity(city) {
            this.city = city;
            this.$rootScope.$emit('newInsertTripCity');
        }

        getCity() {
            return this.city;
        }

        setAccommodationEquipment(equipment) {
            this.accommodationEquipment = equipment;
            this.$rootScope.$emit('newInsertTripAccommodationEquipment');
        }

        getAccommodationEquipment() {
            return this.accommodationEquipment;
        }

        setMood(mood) {
            this.mood = mood;
            this.$rootScope.$emit('newInsertTripMood');
        }

        getMood() {
            return this.mood;
        }

        setResultInfoObject(obj){
            this.resultInfoObject = obj;
        }

        getResultInfoObject(){
            return this.resultInfoObject;
        }
        setPreTrip(trip) {
            this.preTrip = trip;
        }

        getPreTrip() {
            return this.preTrip;
        }

        setLocations(locations) {
            this.locations = locations;
        }

        getLocations() {
            return this.locations;
        }

        clearData() {
            this.preTrip = {};
            this.locations = [];
            this.city = {};
            this.accommodationEquipment = [];
            this.mood = [];
        }

        static serviceId:string = "TripService";
    }
}
