module Service {
    export class SearchService {

        city:any = {};
        mood:any = {};

        constructor(private $http, private $rootScope, private basePath, private lodash, private $ionicLoading) {
        }


        getTripsByQuery(searchQuery) {
            // start loading screen
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});

            // create a copy by value
            var sq = this.lodash.cloneDeep(searchQuery);
            var query = this.basePath + '/trips/search';
            // delete city from query since it is part of the path
            var cityid = sq.city.id;
            delete sq.city;

            // returning a promise inside a promise will make the outside promise resolving if inside is resolved.
            return this.$http({
                url: query + '/' + cityid,
                params: sq,
                method: 'GET'
            });
        }


        getTripById(tripId) {
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            return this.$http.get(this.basePath + '/trips/' + tripId);
        }


        setCity(city) {
            this.city = city;
            this.$rootScope.$emit('newSearchCity');
        }

        getCity() {
            return this.city;
        }


        setMood(mood) {
            this.mood = mood;
            this.$rootScope.$emit('newSearchMood');
        }

        getMood() {
            return this.mood;
        }

        static
            serviceId:string = "SearchService";
    }
}
