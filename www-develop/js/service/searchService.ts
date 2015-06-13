module Service {
    export class SearchService {

        citiesWithTrips = [];

        // TODO: same as in web project - outsource into util library
        constructor(private $http, private basePath, private CacheFactory, private lodash, private DataService, private $q) {
        }


        getTripsByQuery(searchQuery) {
            // create a copy by value
            var sq = this.lodash.cloneDeep(searchQuery);

            var query = this.basePath + '/trips/search';
            return this.getCityId(sq.city).then(cityid => {
                // delete city from query since it is part of the path
                delete sq.city;

                // returning a promise inside a promise will make the outside promise resolving if inside is resolved.
                return this.$http({
                    url: query + '/' + cityid,
                    params: sq,
                    method: 'GET'
                });
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


        static
            serviceId:string = "SearchService";
    }
}
