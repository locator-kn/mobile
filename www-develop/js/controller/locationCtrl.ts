module Controller {
    export class LocationCtrl {
        result:any;
        locationId:number;

        user:any = {};

        map:any = {};
        mapMarkerSet:boolean;

        constructor(private UserService, private $scope, private $stateParams, private LocationService, private $ionicLoading, private webPath) {
            this.locationId = $stateParams.locationId;

            this.map = {center: {latitude: 45, longitude: -73}, zoom: 8};

            this.LocationService.getLocationById(this.locationId).then((result)=> {
                this.result = result.data;

                var lat = result.data.geotag.lat;
                var long = result.data.geotag.long;
                this.map = {
                    center: {
                        // kn fh
                        latitude: lat,
                        longitude: long
                    },
                    zoom: 15,
                    clickedMarker: {
                        latitude: lat,
                        longitude: long,
                        id: 2,
                        options: {
                            labelClass: 'marker-labels',
                            labelAnchor: '50 0'
                        }

                    },
                    scrollwheel	: false,
                    navigationControl	: false,
                    mapTypeControl	: false,
                    scaleControl	: false,
                    draggable	: false
                };


                this.mapMarkerSet = true;

                this.UserService.getUser(this.result.userid)
                    .then(result => {
                        this.user = result.data;
                        this.$ionicLoading.hide();
                    });
            })

        }

        static controllerId:string = "LocationCtrl";
    }
}
