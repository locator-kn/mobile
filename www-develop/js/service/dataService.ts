module Service {
    export class DataService {

        dataCitiesCache;
        dataDaysCache;
        dataPersonsCache;
        dataMoodsCache;
        accommodationEquipmentCache;

        constructor(private $http, private basePath, private CacheFactory, private $q) {
            this.dataCitiesCache = CacheFactory.createCache('dataCities');
            this.dataDaysCache = CacheFactory.createCache('dataDays');
            this.dataPersonsCache = CacheFactory.createCache('dataPersons');
            this.dataMoodsCache = CacheFactory.createCache('dataMoods');
            this.accommodationEquipmentCache = CacheFactory.createCache('accommodationEquipment');
        }

        getAvailableCities() {
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
                                    title: "Rauchen erlaubt",
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
            return this.$q(function (resolve) {
                setTimeout(function () {
                    resolve(
                        {
                            data: [
                                {
                                    query_name: "buddytrip",
                                    title: "Buddytrip",
                                    icon: "buddytrip.svg",
                                    icon_white: "buddytrip.svg",
                                    description: ''
                                }, {
                                    query_name: "girls_on_tour",
                                    title: "Girls on Tour",
                                    icon: "girls_on_tour.svg",
                                    icon_white: "girls_on_tour.svg",
                                    description: ""
                                }, {
                                    query_name: "halligalli_drecksau",
                                    title: "Halligalli Drecksau",
                                    icon: "halligalli_drecksau.svg",
                                    icon_white: "halligalli_drecksau.svg",
                                    description: ""
                                }, {
                                    query_name: "muskelkater",
                                    title: "Muskelkater",
                                    icon: "muskelkater.svg",
                                    icon_white: "muskelkater.svg",
                                    description: ""
                                }, {
                                    query_name: "sturm_der_liebe",
                                    title: "Sturm der Liebe",
                                    icon: "sturm_der_liebe.svg",
                                    icon_white: "sturm_der_liebe.svg",
                                    description: ""
                                }, {
                                    query_name: "gruener_gehts_nicht",
                                    title: "Grüner gehts nicht",
                                    icon: "gruener_gehts_nicht.svg",
                                    icon_white: "gruener_gehts_nicht.svg",
                                    description: ""
                                }, {
                                    query_name: "haste_nicht_gesehen",
                                    title: "Haste nicht gesehen",
                                    icon: "haste_nicht_gesehen.svg",
                                    icon_white: "haste_nicht_gesehen.svg",
                                    description: ""
                                }, {
                                    query_name: "singles_unter_sich",
                                    title: "Singles unter sich",
                                    icon: "singles_unter_sich.svg",
                                    icon_white: "singles_unter_sich.svg",
                                    description: ""
                                }, {
                                    query_name: "family_fun",
                                    title: "Family Fun",
                                    icon: "family_fun.svg",
                                    icon_white: "family_fun.svg",
                                    description: ""
                                }, {
                                    query_name: "kultur_und_sightseeing",
                                    title: "Kultur und Sightseeing",
                                    icon: "kultur_und_sightseeing.svg",
                                    icon_white: "kultur_und_sightseeing.svg",
                                    description: ""
                                }, {
                                    query_name: 'leckermaeulchen',
                                    title: 'Leckermaeulchen',
                                    icon: 'leckermaeulchen.svg',
                                    icon_white: 'leckermaeulchen.svg',
                                    description: ''
                                }, {
                                    query_name: "entspannung_pur",
                                    title: "Entspannnung pur",
                                    icon: "entspannung_pur.svg",
                                    icon_white: "entspannung_pur.svg",
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
