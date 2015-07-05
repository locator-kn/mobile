module Service {
    export class DataService {

        dataCitiesCache;
        dataDaysCache;
        dataPersonsCache;
        dataMoodsCache;
        accommodationEquipmentCache;

        constructor(private $http, private basePath, private CacheFactory, private $q, private $ionicLoading) {
            this.dataCitiesCache = CacheFactory.createCache('dataCities');
            this.dataDaysCache = CacheFactory.createCache('dataDays');
            this.dataPersonsCache = CacheFactory.createCache('dataPersons');
            this.dataMoodsCache = CacheFactory.createCache('dataMoods');
            this.accommodationEquipmentCache = CacheFactory.createCache('accommodationEquipment');
        }

        getAvailableCities() {
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            return this.$http.get(this.basePath + '/data/cities', {cache: this.dataCitiesCache});
        }

        getAvailableDays() {
            return this.$q(function (resolve) {
                setTimeout(function () {
                    resolve(
                        {
                            data: [
                                {value: 1, title: "1"},
                                {value: 2, title: "2"},
                                {value: 3, title: "3"},
                                {value: 4, title: "3+"}
                            ]
                        });
                }, 0);
            }, {cache: this.dataDaysCache});
        }

        getAvailablePersons() {
            return this.$q(function (resolve) {
                setTimeout(function () {
                    resolve(
                        {
                            data: [
                                {value: 1, title: "1"},
                                {value: 2, title: "2"},
                                {value: 3, title: "3"},
                                {value: 4, title: "4"},
                                {value: 5, title: "4+"}
                            ]
                        });
                }, 0);
            }, {cache: this.dataPersonsCache});
        }

        getAvailableAccommodationEquipment() {
            return this.$q(function (resolve) {
                setTimeout(function () {
                    resolve(
                        {
                            data: [
                                {
                                    query_name: 'wifi',
                                    title: "WLAN",
                                    icon: "wifi.png",
                                    icon_grey: "wifi_grey.png"
                                },
                                {
                                    query_name: 'tv',
                                    title: "TV",
                                    icon: "tv.png",
                                    icon_grey: "tv_grey.png"
                                },
                                {
                                    query_name: 'shower',
                                    title: "Dusche/Bad",
                                    icon: "shower.png",
                                    icon_grey: "shower_grey.png"
                                },
                                {
                                    query_name: 'meal',
                                    title: "Küche",
                                    icon: "kitchen.png",
                                    icon_grey: "kitchen_grey.png"
                                },
                                {
                                    query_name: 'breakfast',
                                    title: "Frühstück",
                                    icon: "breakfast.png",
                                    icon_grey: "breakfast_grey.png"
                                },
                                {
                                    query_name: 'smoker',
                                    title: "Raucher",
                                    icon: "smoking.png",
                                    icon_grey: "smoking_grey.png"
                                },
                                {
                                    query_name: 'parking',
                                    title: "Parkplätze",
                                    icon: "parking.png",
                                    icon_grey: "parking_grey.png"
                                },
                                {
                                    query_name: 'handicapped',
                                    title: "Behindertengerecht",
                                    icon: "wheelchair.png",
                                    icon_grey: "wheelchair_grey.png"
                                }
                            ]
                        });
                }, 0);
            }, {cache: this.accommodationEquipmentCache});
        }

        getAvailableMoods() {
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            return this.$q(function (resolve) {
                setTimeout(function () {
                    resolve(
                        {
                            data: [
                                {
                                    query_name: "buddytrip",
                                    title: "buddytrip",
                                    icon: "buddytrip.png",
                                    icon_grey: "buddytrip_grey.png",
                                    description: ''
                                }, {
                                    query_name: "girls_on_tour",
                                    title: "girls on tour",
                                    icon: "girls_on_tour.png",
                                    icon_grey: "girls_on_tour_grey.png",
                                    description: ""
                                }, {
                                    query_name: "halligalli_drecksau",
                                    title: "halligalli drecksau",
                                    icon: "halligalli_drecksau.png",
                                    icon_grey: "halligalli_drecksau_grey.png",
                                    description: ""
                                }, {
                                    query_name: "muskelkater",
                                    title: "muskelkater",
                                    icon: "muskelkater.png",
                                    icon_grey: "muskelkater_grey.png",
                                    description: ""
                                }, {
                                    query_name: "sturm_der_liebe",
                                    title: "strum der liebe",
                                    icon: "sturm_der_liebe.png",
                                    icon_grey: "sturm_der_liebe_grey.png",
                                    description: ""
                                }, {
                                    query_name: "gruener_gehts_nicht",
                                    title: "gruener gehts nicht",
                                    icon: "gruener_gehts_nicht.png",
                                    icon_grey: "gruener_gehts_nicht_grey.png",
                                    description: ""
                                }, {
                                    query_name: "haste_nicht_gesehen",
                                    title: "haste nicht gesehen",
                                    icon: "haste_nicht_gesehen.png",
                                    icon_grey: "haste_nicht_gesehen_grey.png",
                                    description: ""
                                }, {
                                    query_name: "singles_unter_sich",
                                    title: "singles unter sich",
                                    icon: "singles_unter_sich.png",
                                    icon_grey: "singles_unter_sich_grey.png",
                                    description: ""
                                }, {
                                    query_name: "family_fun",
                                    title: "family fun",
                                    icon: "family_fun.png",
                                    icon_grey: "family_fun_grey.png",
                                    description: ""
                                }, {
                                    query_name: "kultur_und_sightseeing",
                                    title: "kultur und sightseeing",
                                    icon: "kultur_und_sightseeing.png",
                                    icon_grey: "kultur_und_sightseeing_grey.png",
                                    description: ""
                                }, {
                                    query_name: 'leckermaeulchen',
                                    title: 'leckermaeulchen',
                                    icon: 'leckermaeulchen.png',
                                    icon_grey: 'leckermaeulchen_grey.png',
                                    description: ''
                                }, {
                                    query_name: "entspannung_pur",
                                    title: "entspannnung pur",
                                    icon: "entspannung_pur.png",
                                    icon_grey: "entspannung_pur_grey.png",
                                    description: ""
                                }
                            ]
                        });
                }, 0);
            }, {cache: this.dataMoodsCache});
        }


        static serviceId:string = "DataService";
    }
}
