module Controller {
    export class GoogleMapCtrl {

        //map:any = {};

        googleMap:boolean = false;
        mapIsReady:boolean = false;
        mapMarkerSet:boolean;

        lat;
        long;

        oldResultObject:any = {};

        map = {
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
            events: null
        };

        constructor(private $ionicLoading, private GeolocationService, private $scope, private maxSpinningDuration) {
            // google analytics
            if (typeof analytics !== undefined && typeof analytics !== 'undefined') {
                analytics.trackView("GoogleMap Controller");
            }

            var oldResultObject = this.GeolocationService.getGeoPosition();

            if (oldResultObject.center) {
                this.mapMarkerSet = true;
                this.map.center = oldResultObject.center;
                this.map.clickedMarker = oldResultObject.clickedMarker;
                if (!this.$scope.$$phase) {
                    this.$scope.$apply();
                }
            }
            this.map.events = this.getEvents();
        }

        getEvents() {
            return {
                mousedown: (mapModel, eventName, originalEventArgs) => {
                    this.clickMapEvent(mapModel, eventName, originalEventArgs);
                },
                tilesloaded: () => {
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
            if (!this.$scope.$$phase) {
                this.$scope.$apply();
            }
            this.GeolocationService.setGeoPosition(this.map);
        }

        // sample
        getCurrentPosition = () => {
            if (this.mapIsReady) {
                this.$ionicLoading.show({
                    templateUrl: 'templates/static/loading.html',
                    duration: this.maxSpinningDuration
                });

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
                    this.$ionicLoading.hide();

                })
            }
        };

        static controllerId:string = "GoogleMapCtrl";
    }
}
