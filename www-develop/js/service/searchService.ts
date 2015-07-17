module Service {
    export class SearchService {

        city:any = {};
        mood:any = {};

        results:any;

        queryPath = this.basePath + '/trips/search';
        sq:any = {};
        cityId:string;

        constructor(private $http, private $rootScope, private basePath, private lodash, private $ionicLoading) {
        }


        getTripsByQuery(searchQuery) {
            // create a copy by value
            var sq = this.lodash.cloneDeep(searchQuery);

            // delete city from query since it is part of the path
            var cityid = sq.city.id;
            delete sq.city;
            // fix for moods -> currently one mood in array
            var moodArray = [];
            moodArray.push(sq.moods.query_name);
            sq.moods = moodArray;

            // save query for pagination -> same query -> other page size
            this.cityId = cityid;
            this.sq = sq;

            // returning a promise inside a promise will make the outside promise resolving if inside is resolved.
            return this.$http({
                url: this.queryPath + '/' + cityid,
                params: sq,
                method: 'GET'
            });
        }

        setQuery(searchQuery) {
            // create a copy by value
            var sq = this.lodash.cloneDeep(searchQuery);

            // delete city from query since it is part of the path
            var cityid = sq.city.id;
            delete sq.city;
            // fix for moods -> currently one mood in array
            var moodArray = [];
            moodArray.push(sq.moods.query_name);
            sq.moods = moodArray;

            // save query for pagination -> same query -> other page size
            this.cityId = cityid;
            this.sq = sq;
        }

        getNextTripsFromQuery(pageNumber, pageSize?) {
            if (pageNumber) {
                this.sq.page = pageNumber;
                if (pageSize) {
                    this.sq.page_size = pageSize;
                }
            }

            // returning a promise inside a promise will make the outside promise resolving if inside is resolved.
            return this.$http({
                url: this.queryPath + '/' + this.cityId,
                params: this.sq,
                method: 'GET'
            });
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


        setMood(mood) {
            this.mood = mood;
            this.$rootScope.$emit('newSearchMood');
        }

        getMood() {
            return this.mood;
        }

        setResults(results) {
            this.results = results;
            this.$rootScope.$emit('newSearchResults');
        }

        getResults() {
            return this.results;
        }


        static
            serviceId:string = "SearchService";
    }
}
