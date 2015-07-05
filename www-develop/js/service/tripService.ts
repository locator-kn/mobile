module Service {
    export class TripService {

        preTrip:any = {};
        locations:any = [];

        // create trip
        city:any = {};
        accommodationEquipment:any = [];
        mood:any = {};

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

        setPreTrip(trip){
            this.preTrip = trip;
        }

        getPreTrip(trip){
            this.preTrip = trip;
        }

        setLocations(locations){
            this.locations = locations;
        }

        getLocations(){
            this.locations;
        }
        static serviceId:string = "TripService";
    }
}
