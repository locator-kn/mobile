module Controller {
    export class GoogleMapCtrl {

        map:any = {};

        googleMap:boolean = false;
        mapIsReady:boolean = false;
        mapMarkerSet:boolean;

        lat:string;
        long:string;

        constructor(private $ionicLoading, private GeolocationService, private $scope) {
            this.map = {
                center: {
                    // kn fh
                    latitude: 47.668403,
                    longitude: 9.170499
                },
                zoom: 12,
                clickedMarker: {
                    id: 0,
                    latitude: null,
                    longitude: null
                },
                events: this.getEvents()
            };
        }

        getEvents() {
            return {
                mousedown: (mapModel, eventName, originalEventArgs) => {
                    this.clickMapEvent(mapModel, eventName, originalEventArgs);
                },
                tilesloaded: () => {
                    this.mapIsReady = true;
                    this.getCurrentPosition();
                    this.$ionicLoading.hide();

                }
            }
        }

        clickMapEvent(mapModel, eventName, originalEventArgs) {
            var e = originalEventArgs[0];
            var lat = e.latLng.lat(),
                lon = e.latLng.lng();
            this.map.clickedMarker = {
                id: 0,
                options: {
                    labelClass: "marker-labels",
                    labelAnchor: "50 0"
                },
                latitude: lat,
                longitude: lon
            };
            this.mapMarkerSet = true;
            this.GeolocationService.setGeoPosition(this.map);
        }

        // sample
        getCurrentPosition = () => {
            if (this.mapIsReady) {
                if (!this.googleMap) {
                    this.googleMap = true;
                    this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
                }

                this.GeolocationService.getCurrentLocation().then((position) => {
                    this.lat = position.coords.latitude;
                    this.long = position.coords.longitude;

                    this.map.clickedMarker.latitude = this.lat;
                    this.map.clickedMarker.longitude = this.long;
                    this.map.zoom = 15;
                    this.map.center.latitude = this.lat;
                    this.map.center.longitude = this.long;

                    this.GeolocationService.setGeoPosition(this.map);
                    this.mapMarkerSet = true;
                    if (!this.$scope.$$phase) {
                        this.$scope.$apply();
                    }

                })
            }
        };

        static controllerId:string = "GoogleMapCtrl";
    }
}
