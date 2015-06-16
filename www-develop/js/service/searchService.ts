module Service {
    export class SearchService {

        citiesWithTrips = [];

        city:any = {};

        // TODO: same as in web project - outsource into util library
        constructor(private $http, private $rootScope, private basePath, private lodash, private DataService, private $q, private $ionicLoading) {
        }


        getTripsByQuery(searchQuery) {
            // start loading screen
            this.$ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner>'
            });

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


        getCityId(city) {
            var promise = this.$q((resolve, reject) => {
                this.DataService.getAvailableCities()
                    .then(result => {
                        this.citiesWithTrips = result.data;
                        var cityObject = this.lodash.findWhere(this.citiesWithTrips, {title: city});
                        if (cityObject.place_id) {
                            return resolve(cityObject.id);
                        }
                        reject({msg: 'not found'});
                    });
            });

            return promise;
        }

        getTripById(tripId) {
            return this.$http.get(this.basePath + '/trips/' + tripId);
        }


        setCity(city) {
            this.city = city;
            this.$rootScope.$emit('newSearchCity');
        }

        getCity() {
            return this.city;
        }

        static
            serviceId:string = "SearchService";
    }
}
