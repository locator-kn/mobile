module Service {
    export class TripService {

        preTrip:any = {};
        locations:any = [];

        // create trip
        city:any = {};
        accommodationEquipment:any = [];
        mood:any = [];

        sq:any = {};

        resultInfoObject:any = {};

        constructor(private $http, private basePath, private $ionicLoading, private $rootScope) {

            $rootScope.$on('resetTripData', () => {
                this.preTrip = {};
                this.locations = [];
                this.city = {};
                this.accommodationEquipment = [];
                this.mood = [];
                this.sq = {};
            });

        }

        saveTrip(trip, id) {
            if(id){
                return this.$http.put(this.basePath + '/trips/' + id, trip)
            }
            return this.$http.post(this.basePath + '/trips', trip);
        }

        getNextTripsFromUser(userId, pageNumber?, pageSize?) {
            if (pageNumber >= 0) {
                this.sq.page = pageNumber;
                if (pageSize) {
                    this.sq.elements = pageSize;
                }
            }
            return this.$http({
                url: this.basePath + '/users/' + userId + '/trips',
                params: this.sq,
                method: 'GET'
            });
        }

        getNextTripsFromMe(pageNumber?, pageSize?) {
            if (pageNumber >= 0) {
                this.sq.page = pageNumber;
                if (pageSize) {
                    this.sq.elements = pageSize;
                }
            }
            return this.$http({
                url: this.basePath + '/users/my/trips',
                params: this.sq,
                method: 'GET'
            });
        }

        // @deprecated
        getTripsByUser(userid) {
            return this.$http.get(this.basePath + '/users/' + userid + '/trips');
        }

        togglePublicTrips(tripId) {
            return this.$http.put(this.basePath + '/trips/' + tripId + '/togglePublic');
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

        setResultInfoObject(obj) {
            this.resultInfoObject = obj;
        }

        getResultInfoObject() {
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
